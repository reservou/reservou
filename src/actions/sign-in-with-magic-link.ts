"use server";

import { uid } from "uid";
import { CONFIRMATION_TOKEN_EXPIRY_IN_MINUTES } from "../constants/auth";
import { getEnv } from "../env";
import { BadRequestError } from "../errors";
import { buildAction } from "../lib/action";
import { database } from "../lib/database";
import { mailer } from "../lib/mailer";
import { redis } from "../lib/redis";
import { validator } from "../lib/validator";
import { type IUserModel, UserModel } from "../models/user";
import { type SignInInput, signInSchema } from "../schemas/sign-in-schema";
import type { SignUpIntent } from "../types";

export const signInWithMagicLink = buildAction(async (input: SignInInput) => {
	const { email } = await validator(signInSchema, input);

	await database.connect();
	const user = await UserModel.findOne({ email }).lean();

	if (!user) {
		throw new BadRequestError(
			"Usuário não encontrado. Por favor, cadastre-se.",
		);
	}

	const token = await resolveConfirmationToken();
	await sendConfirmationMail(token);

	async function resolveConfirmationToken() {
		const previousToken = await redis.get<string>(email);
		const expiry = CONFIRMATION_TOKEN_EXPIRY_IN_MINUTES;

		if (previousToken) {
			await redis.expire(email, expiry);
			await redis.expire(previousToken, expiry);
			return previousToken;
		}

		const token = uid();
		await redis.set(email, token);
		await redis.set(token, {
			email,
			name: (user as unknown as IUserModel).name,
		} satisfies SignUpIntent);

		return token;
	}

	async function sendConfirmationMail(token: string) {
		await mailer.sendMail({
			to: email,
			from: "hey@reservou.xyz",
			text: `Acesse sua conta por esse link: ${getEnv("NEXT_PUBLIC_APP_URL")}/access/${token}`,
		});
	}
});
