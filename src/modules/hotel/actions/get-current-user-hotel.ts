"use server";

import { buildAction } from "@/src/lib/action";
import { storage } from "@/src/lib/storage";
import { PHOTO_EXPIRY_MS } from "../../gallery/constants";
import type { IHotel } from "../models/hotel";
import { getCurrentUserHotelOrThrow } from "../utils/get-current-user-hotel-or-throw";

export type GetCurrentUserHotelOutput = Omit<IHotel, "geolocation"> & {
	id: string;
};

export const getCurrentUserHotel = buildAction(
	async (): Promise<GetCurrentUserHotelOutput> => {
		const hotel = await getCurrentUserHotelOrThrow();

		return {
			id: hotel._id.toString(),
			slug: hotel.slug,
			name: hotel.name,
			formattedAddress: hotel.formattedAddress,
			category: hotel.category,
			description: hotel.description,
			amenities: hotel.amenities,
			banner: hotel.banner && {
				url: hotel.banner.url,
				fileKey: hotel.banner.fileKey,
				alt: hotel.banner.alt,
			},
			contact: {
				email: hotel.contact.email,
				phone: hotel.contact.phone,
				website: hotel.contact.website,
			},
			location: {
				address: hotel.location.address,
				city: hotel.location.city,
				state: hotel.location.state,
				country: hotel.location.country,
				zipCode: hotel.location.zipCode,
			},
			photos: hotel.photos.map((photo) => ({
				fileKey: photo.fileKey,
				alt: photo.alt,
				url: photo.url,
			})),
			plan: hotel.plan,
			planExpiresAt: hotel.planExpiresAt,
			updatedAt: hotel.updatedAt,
			createdAt: hotel.createdAt,
		};
	},
);
