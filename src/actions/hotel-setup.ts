"use server";

import { InternalServerError } from "../errors";
import { buildAction } from "../lib/action";
import { database } from "../lib/database";
import { geocodeAddress } from "../lib/geocode";
import { clearJwtFromCookies, encryptJwt, setJwtToCookies } from "../lib/jwt";
import { validator } from "../lib/validator";
import { HotelModel, generateUniqueSlug } from "../models/hotel";
import { Plan } from "../models/plan";
import {
	type HotelSetupFormValues as HotelSetupInput,
	hotelSetupSchema,
} from "../schemas/hotel-setup-schema";
import type { AccessTokenPayload } from "../types";
import { buildAddressString } from "../utils/build-address-string";
import { getCurrentUserOrThrow } from "../utils/get-current-user-or-throw";

export const hotelSetup = buildAction(async (input: HotelSetupInput) => {
	const {
		name,
		email,
		address,
		category,
		city,
		country,
		description,
		phone,
		state,
		zipCode,
		website,
	} = await validator(hotelSetupSchema, input);
	await database.connect();

	const currentUser = await getCurrentUserOrThrow();

	if (currentUser.hotel) {
		throw new InternalServerError(
			"User with hotel should not be able to call hotel setup",
			{
				action: hotelSetup.name,
				userId: currentUser._id,
				name: "Conflict",
			},
		);
	}

	const locationObject = {
		address,
		city,
		country,
		state,
		zipCode,
	};
	const locationString = buildAddressString(locationObject);
	const geolocation = await geocodeAddress(locationString);

	const hotel = await HotelModel.create({
		geolocation: {
			type: "Point",
			coordinates: [geolocation.lng, geolocation.lat],
		},
		address: geolocation.formattedAddress,
		name,
		location: {
			city,
			state,
			country,
			zipCode,
		},
		contact: {
			email,
			phone,
			website,
		},
		description,
		category,
		slug: await generateUniqueSlug({ city, country, name }),
		plan: Plan.BASIC,
		planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
	});

	await clearJwtFromCookies();

	await setJwtToCookies(
		await encryptJwt({
			uid: currentUser._id.toString(),
			hid: hotel._id.toString(),
		} satisfies AccessTokenPayload),
	);

	return hotel;
});
