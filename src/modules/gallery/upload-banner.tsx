"use server";

import { buildAction } from "@/src/lib/action";
import { mediaManager } from "@/src/lib/media-manager";
import { HotelModel } from "../hotel/models/hotel";
import { getCurrentUserHotelOrThrow } from "../hotel/utils/get-current-user-hotel-or-throw";
import type { Media } from "./upload-photo";

export const uploadBanner = buildAction(async (file: File): Promise<Media> => {
	const hotel = await getCurrentUserHotelOrThrow();

	if (hotel.banner) {
		await mediaManager.delete(hotel.banner.fileKey);
	}

	const { fileKey, url } = await mediaManager.upload(
		file,
		`hotel/${hotel.id}/banner`,
	);

	hotel.banner = {
		fileKey,
		url,
		alt: "",
	};

	await hotel.save();

	return { fileKey, url, alt: "" };
});

export const removeBanner = buildAction(async (file: File) => {
	const hotel = await getCurrentUserHotelOrThrow();

	if (hotel.banner) {
		await mediaManager.delete(hotel.banner.fileKey);
	}
});
