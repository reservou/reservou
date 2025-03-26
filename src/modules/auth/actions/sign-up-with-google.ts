"use server";

import { buildAction } from "@/src/lib/action";
import { database } from "@/src/lib/database";
import { BadRequestError, InternalServerError } from "@/src/lib/errors";
import { auth } from "@/src/lib/firebase/admin";
import { encryptJwt, setJwtToCookies } from "@/src/lib/jwt";
import { UserModel } from "../models/user";
import type { AccessTokenPayload } from "../types";

export type GoogleSignUpOutput = {
	id: string;
	name: string;
	email: string;
};

export const signUpWithGoogle = buildAction(
	async ({
		idToken,
		name,
	}: { idToken: string; name: string }): Promise<GoogleSignUpOutput> => {
		let email: string | undefined;

		try {
			const decodedIdToken = await auth.verifyIdToken(idToken);
			email = decodedIdToken.email;
		} catch (error) {
			if (error instanceof InternalServerError) {
				console.error(error);
			}
			throw new BadRequestError("Token de autenticação inválido ou expirado.");
		}

		if (!email) {
			throw new BadRequestError("E-mail não fornecido pelo provedor Google.");
		}

		if (!name || name.trim() === "") {
			throw new BadRequestError("Nome é obrigatório para cadastro.");
		}

		await database.connect();

		let user = await UserModel.findOne({ email });

		if (!user) {
			user = new UserModel({
				name,
				email,
			});
			await user.save();
		} else {
			if (user.name !== name) {
				user.name = name;
				await user.save();
			}
		}

		const { id, hotel } = user;

		const jwtToken = await encryptJwt({
			uid: id,
			hid: hotel?._id.toString(),
		} satisfies AccessTokenPayload);

		await setJwtToCookies(jwtToken);

		return {
			id,
			name: user.name,
			email,
		};
	},
);
