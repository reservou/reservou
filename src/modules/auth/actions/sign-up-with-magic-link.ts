"use server";

import { uid } from "uid";
import { getEnv } from "../../../env";
import { buildAction } from "../../../lib/action";
import { mailer } from "../../../lib/mailer";
import { redis } from "../../../lib/redis";
import { validator } from "../../../lib/validator";
import { CONFIRMATION_TOKEN_EXPIRY_IN_MINUTES } from "../constants";
import { type SignUpInput, signUpSchema } from "../schemas/sign-up-schema";
import type { SignUpIntent } from "../types";

export const signUpWithMagicLink = buildAction(async (input: SignUpInput) => {
	const { email, name } = await validator(signUpSchema, input);

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
		await redis.set(token, { name, email } satisfies SignUpIntent);

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
