"use server";

import { buildAction } from "@/src/lib/action";
import { validator } from "@/src/lib/validator";
import { HotelModel } from "../models/hotel";
import {
	type GeneralInfoFormValues,
	generalInfoSchema,
} from "../schemas/landing-page-schema";
import { getCurrentUserHotelOrThrow } from "../utils/get-current-user-hotel-or-throw";

export const updateHotelGeneralInfo = buildAction(
	async (input: GeneralInfoFormValues) => {
		const { description, name, slug } = await validator(
			generalInfoSchema,
			input,
		);

		const currentHotel = await getCurrentUserHotelOrThrow();

		await HotelModel.updateOne(
			{ _id: currentHotel._id },
			{ description, name, slug },
			{ ignoreUndefined: true },
		);
	},
);
