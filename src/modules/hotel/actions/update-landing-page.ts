"use server";

import { buildAction } from "@/src/lib/action";
import { BadRequestError } from "@/src/lib/errors";
import { geocodeAddress } from "@/src/lib/geocode";
import { validator } from "@/src/lib/validator";
import type { z } from "zod";
import { HotelModel, type IHotel } from "../models/hotel";
import { locationSchema } from "../schemas/hotel-setup-schema";
import {
	amenitiesSchema,
	generalInfoSchema,
} from "../schemas/landing-page-schema";
import { buildAddressString } from "../utils/build-address-string";
import { getCurrentUserHotelOrThrow } from "../utils/get-current-user-hotel-or-throw";
import { getZipCodeDetails } from "./get-zipcode-details";

const landingPageInputSchema = generalInfoSchema
	.merge(locationSchema)
	.merge(amenitiesSchema)
	.partial();

type UpdateLandingPageInput = z.infer<typeof landingPageInputSchema>;
type UpdateLandingPageOutput = {
	id: string;
	name: string;
	description: string;
	slug: string;
	amenities: string[];
	location: {
		address: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
	};
};

export const updateLandingPage = buildAction(
	async (input: UpdateLandingPageInput): Promise<UpdateLandingPageOutput> => {
		const cleanInput = await validator(landingPageInputSchema, input);
		const hotel = await getCurrentUserHotelOrThrow();

		// separate the nested fields
		const { address, zipCode, city, state, country, ...topLevelFields } =
			cleanInput;

		const location = hotel.location;

		if (zipCode) {
			const detailsOutput = await getZipCodeDetails(zipCode);
			if (detailsOutput.success) {
				location.city = detailsOutput.data.city;
				location.state = detailsOutput.data.state;
				location.country = detailsOutput.data.country;
				location.zipCode = zipCode;
				location.address = address ?? detailsOutput.data.street;
			} else {
				throw new BadRequestError(detailsOutput.message);
			}

			const geolocation = await geocodeAddress(zipCode);
			hotel.geolocation.coordinates = [geolocation.lng, geolocation.lat];
		}

		hotel.location = location;

		for (const key in topLevelFields) {
			hotel[key as keyof IHotel] =
				topLevelFields[key as keyof typeof topLevelFields] ??
				hotel[key as keyof typeof hotel];
		}

		await hotel.save();

		return {
			id: hotel.id,
			slug: hotel.slug,
			name: hotel.name,
			description: hotel.description,
			location: {
				address: location.address,
				city: location.city,
				state: location.state,
				country: location.country,
				zipCode: location.zipCode,
			},
			amenities: hotel.amenities,
		};
	},
);
