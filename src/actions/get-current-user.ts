"use server";

import { UnauthorizedError } from "../errors";
import { buildAction } from "../lib/action";
import { database } from "../lib/database";
import { getJwtPayloadFromCookies } from "../lib/jwt";
import { UserModel, type UserRole } from "../models/user";

export type GetCurrentUserOutput = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	hotel?: string;
};

export const getCurrentUser = buildAction(
	async (): Promise<GetCurrentUserOutput> => {
		const payload = await getJwtPayloadFromCookies<{
			id: string;
			email: string;
			name: string;
		}>();

		if (!payload) {
			throw new UnauthorizedError("Usuário não autenticado.");
		}

		const { id } = payload;

		await database.connect();

		const user = await UserModel.findById(id).lean();
		if (!user) {
			throw new UnauthorizedError("Usuário não encontrado.");
		}

		return {
			id: user._id.toString(),
			email: user.email,
			name: user.name,
			role: user.role,
			hotel: user.hotel?.toString(),
		};
	},
);
