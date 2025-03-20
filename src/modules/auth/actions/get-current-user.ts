"use server";

import { buildAction } from "@/src/lib/action";
import { database } from "@/src/lib/database";
import { InternalServerError, UnauthorizedError } from "@/src/lib/errors";
import { getJwtFromCookies, getJwtPayloadFromCookies } from "@/src/lib/jwt";
import { UserModel, type UserRole } from "@/src/modules/auth/models/user";
import type { AccessTokenPayload } from "../types";

export type GetCurrentUserOutput = {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	hotel?: string;
};

export const getCurrentUser = buildAction(
	async (): Promise<GetCurrentUserOutput> => {
		const payload = await getJwtPayloadFromCookies<AccessTokenPayload>();

		if (!payload) {
			throw new UnauthorizedError("Usuário não autenticado.");
		}

		const { uid } = payload;

		await database.connect();

		const user = await UserModel.findById(uid).lean();
		if (!user) {
			throw new InternalServerError(
				"JWT token user id does not match do a record in database",
				{
					action: getCurrentUser.name,
					userId: payload.uid,
					token: await getJwtFromCookies(),
				},
			);
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
