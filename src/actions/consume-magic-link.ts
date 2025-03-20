"use server";

import { BadRequestError } from "../errors";
import { buildAction } from "../lib/action";
import { database } from "../lib/database";
import { encryptJwt, setJwtToCookies } from "../lib/jwt";
import { redis } from "../lib/redis";
import { UserModel } from "../models/user";
import type { AccessTokenPayload, SignUpIntent } from "../types";

export type MagicLinkOutput = {
	id: string;
	name: string;
	email: string;
};

export const consumeMagicLink = buildAction(
	async (token: string): Promise<MagicLinkOutput> => {
		const intent = await redis.get<SignUpIntent>(token);

		if (!intent) {
			throw new BadRequestError(
				"Link inválido ou expirado, faça login novamente.",
			);
		}

		const { email, name } = intent;

		await database.connect();

		const userFound = await UserModel.findOne({ email });

		if (userFound) {
			const { id, name } = userFound;
			return {
				id,
				email,
				name,
			};
		}

		const user = new UserModel({
			name,
			email,
		});

		const { id } = await user.save();

		const jwtToken = await encryptJwt({
			uid: id,
		} satisfies AccessTokenPayload);
		await setJwtToCookies(jwtToken);

		return {
			id,
			email,
			name,
		};
	},
);
