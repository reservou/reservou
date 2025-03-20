"use server";

import { buildAction } from "@/src/lib/action";
import { database } from "@/src/lib/database";
import { BadRequestError } from "@/src/lib/errors";
import { auth } from "@/src/lib/firebase/admin";
import { encryptJwt, setJwtToCookies } from "@/src/lib/jwt";
import { UserModel } from "../models/user";
import type { AccessTokenPayload } from "../types";

export type GoogleSignInOutput = {
	id: string;
	name: string;
	email: string;
};

export const signInWithGoogle = buildAction(
	async (idToken: string): Promise<GoogleSignInOutput> => {
		let email: string | null;
		try {
			const decodedToken = await auth.verifyIdToken(idToken);
			email = decodedToken.email ?? null;
		} catch (error) {
			throw new BadRequestError("Token de autenticação inválido ou expirado.");
		}

		if (!email) {
			throw new BadRequestError("E-mail não fornecido pelo provedor Google.");
		}

		await database.connect();

		const user = await UserModel.findOne({ email });
		if (!user) {
			throw new BadRequestError(
				"Usuário não encontrado. Por favor, cadastre-se.",
			);
		}

		const { id, name, hotel } = user;

		const jwtPayload: AccessTokenPayload = {
			uid: id,
			hid: hotel?.id.toString(),
		};

		const jwtToken = await encryptJwt(jwtPayload);
		await setJwtToCookies(jwtToken);
		return {
			id,
			name,
			email,
		};
	},
);
