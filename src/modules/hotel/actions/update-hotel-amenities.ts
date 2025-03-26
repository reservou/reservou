"use server";

import { buildAction } from "@/src/lib/action";
import { validator } from "@/src/lib/validator";
import { HotelModel } from "../models/hotel";
import { amenitiesSchema } from "../schemas/landing-page-schema";
import { getCurrentUserHotelOrThrow } from "../utils/get-current-user-hotel-or-throw";

export const updateHotelAmenities = buildAction(async (amenities: string[]) => {
	const { amenities: cleanAmenities } = await validator(amenitiesSchema, {
		amenities,
	});

	const hotel = await getCurrentUserHotelOrThrow();

	await HotelModel.updateOne(
		{
			_id: hotel._id,
		},
		{
			amenities,
		},
	);
});
