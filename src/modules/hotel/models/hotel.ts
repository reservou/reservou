import { resolveMongooseModel } from "@/src/lib/database";
import {
	type SlugGenerationParams,
	generateBaseSlug,
	slugStrategies,
} from "@/src/modules/hotel/utils/generate-base-slug";
import { type Model, Schema } from "mongoose";
import { Plan } from "./plan";

export interface IHotel {
	name: string;
	slug: string;
	description: string;
	geolocation: {
		type: "Point";
		coordinates: [number, number];
	};
	formattedAddress: string;
	location: {
		address: string;
		city: string;
		state: string;
		country: string;
		zipCode?: string;
	};
	contact: {
		email: string;
		phone: string;
		website?: string;
	};
	category: string;
	bannerFileKey: string;
	photos: Array<{
		id: string;
		fileKey: string;
		alt: string;
	}>;
	amenities: string[];
	plan: Plan;
	planExpiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

const HotelSchema: Schema = new Schema({
	name: { type: String, required: true },
	slug: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	geolocation: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
			required: true,
		},
	},
	formattedAddress: { type: String, required: true },
	location: {
		address: { type: String, required: true },
		city: { type: String, required: true },
		state: { type: String, required: true },
		country: { type: String, required: true },
		zipCode: { type: String },
	},
	contact: {
		email: { type: String, required: true },
		phone: { type: String, required: true },
		website: { type: String },
	},
	category: { type: String, required: true },
	bannerFileKey: { type: String, default: "" },
	photos: [
		{
			id: { type: String, required: true },
			fileKey: { type: String, required: true },
			alt: { type: String, default: "" },
		},
	],
	amenities: [{ type: String }],
	plan: {
		type: String,
		enum: Plan,
		default: Plan.BASIC,
	},
	planExpiresAt: { type: Date, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

/**
 * Generates a unique SEO friendly slug for the hotel following {@link strategies} strategies
 */
export async function generateUniqueSlug(
	params: SlugGenerationParams,
): Promise<string> {
	let slug: string;
	let strategyIndex = 0;

	while (strategyIndex < slugStrategies.length) {
		slug = generateBaseSlug(params, strategyIndex);
		let counter = 0;
		let candidateSlug = slug;

		while (await HotelModel.exists({ slug: candidateSlug })) {
			counter++;
			candidateSlug = `${slug}-${counter}`;
			if (candidateSlug.length > 60) {
				candidateSlug = `${slug.slice(0, 55)}-${counter}`;
			}
		}

		if (counter === 0 || !(await HotelModel.exists({ slug: candidateSlug }))) {
			return candidateSlug;
		}

		strategyIndex++;
	}

	// Fallback with timestamp
	slug = `${generateBaseSlug(params, 0)}-${Date.now().toString(36)}`;
	return slug;
}

/**
 * Index for handling Geospatial queries
 */
HotelSchema.index({ geolocation: "2dsphere" });

export type IHotelModel = Model<IHotel>;

export const HOTEL_MODEL_KEY = "hotels";
export const HotelModel: IHotelModel = resolveMongooseModel(
	HOTEL_MODEL_KEY,
	HotelSchema,
);
