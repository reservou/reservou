"use server";

import { buildAction } from "@/src/lib/action";
import { geocodeAddress } from "@/src/lib/geocode";
import { validator } from "@/src/lib/validator";
import { HotelModel } from "../models/hotel";
import {
	type LocationFormValues,
	locationSchema,
} from "../schemas/hotel-setup-schema";
import { buildAddressString } from "../utils/build-address-string";
import { getCurrentUserHotelOrThrow } from "../utils/get-current-user-hotel-or-throw";

/**
 * Updates the hotel location with the formatted address and geolocation
 * Takes the whole location object to generate the formatted address and geolocation
 */
export const updateHotelLocation = buildAction(
	async (input: LocationFormValues) => {
		const cleanInput = await validator(locationSchema, input);
		const hotel = await getCurrentUserHotelOrThrow();
		const geolocation = await geocodeAddress(buildAddressString(cleanInput));

		await HotelModel.updateOne(
			{
				_id: hotel._id,
			},
			{
				formattedAddress: geolocation.formattedAddress,
				location: {
					address: input.address,
					city: input.city,
					state: input.state,
					country: input.country,
					zipCode: input.zipCode,
				},
				geolocation: {
					type: "Point",
					coordinates: [geolocation.lng, geolocation.lat],
				},
			},
		);
	},
);
