"use server";

import { BadRequestError, InternalServerError } from "../errors";
import { buildAction } from "../lib/action";
import { database } from "../lib/database";
import { auth } from "../lib/firebase/admin";
import { encryptJwt, setJwtToken } from "../lib/jwt";
import { UserModel } from "../models/user";

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
				console.log();
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

		const { id } = user;

		const jwtToken = await encryptJwt({ id, email, name: user.name });
		await setJwtToken(jwtToken);

		return {
			id,
			name: user.name,
			email,
		};
	},
);
