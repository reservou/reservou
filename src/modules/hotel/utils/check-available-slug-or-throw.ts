import { ConflictError } from "@/src/lib/errors";
import { HotelModel } from "../models/hotel";

/**
 * Checks if the slug is not in use by other hotel
 * @throws {@link ConflictError} - If the slug is already in use
 */
export async function checkAvailableSlugOrThrow(slug: string) {
	const existingHotel = await HotelModel.findOne({
		slug,
	});

	if (existingHotel) {
		throw new ConflictError("Slug já está em uso");
	}
}
