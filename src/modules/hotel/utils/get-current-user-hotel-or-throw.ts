"server-only";

import { database } from "@/src/lib/database";
import {
	ForbiddenError,
	InternalServerError,
	UnauthorizedError,
} from "@/src/lib/errors";
import { getJwtPayloadFromCookies } from "@/src/lib/jwt";
import type { AccessTokenPayload } from "../../auth/types";
import { HotelModel } from "../models/hotel";

/**
 * Get the authenticated user's hotel or throw an error if the user does not have a hotel
 * Meant to be used inside server actions to ensure the user has a hotel
 * @throws {@link ForbiddenError} - If the authenticated user does not have a hotel
 * @returns The authenticated user's hotel
 */
export async function getCurrentUserHotelOrThrow() {
	const token = await getJwtPayloadFromCookies<AccessTokenPayload>();
	if (!token) {
		throw new UnauthorizedError("Usuário não autenticado, faça login.");
	}

	const { uid, hid } = token;
	if (!hid) {
		throw new ForbiddenError("Usuário não possui um hotel cadastrado", {
			uid,
		});
	}

	await database.connect();
	const hotel = await HotelModel.findOne({ _id: hid });

	if (!hotel) {
		throw new InternalServerError(
			"`hid` is present in the token but hotel is not found in database",
			{
				hid,
				uid,
				token,
				fn: getCurrentUserHotelOrThrow.name,
			},
		);
	}

	return hotel;
}
