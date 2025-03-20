"server-only";

import { database } from "@/src/lib/database";
import { InternalServerError, UnauthorizedError } from "@/src/lib/errors";
import { getJwtFromCookies, getJwtPayloadFromCookies } from "@/src/lib/jwt";
import { getCurrentUser } from "@/src/modules/auth/actions/get-current-user";
import { UserModel } from "@/src/modules/auth/models/user";
import type { AccessTokenPayload } from "@/src/modules/auth/types";

/**
 * Helper function to be used inside server actions, not to be called from client
 * components since there is no error handling
 *
 * @throws {@link UnauthorizedError} if the user is not authenticated
 */
export async function getCurrentUserOrThrow() {
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

	return user;
}
