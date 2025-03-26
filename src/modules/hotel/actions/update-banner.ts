"use server";

import { buildAction } from "@/src/lib/action";
import { storage } from "@/src/lib/storage";
import { getBannerFileKey } from "../../gallery/utils";
import { HotelModel } from "../models/hotel";
import { getCurrentUserHotelOrThrow } from "../utils/get-current-user-hotel-or-throw";

/**
 * Updates the current authenticated user's hotel banner image
 */
export const updateBanner = buildAction(async (bannerFile: File) => {
	const currentHotel = await getCurrentUserHotelOrThrow();

	const existingBannerFileKey = currentHotel.bannerFileKey;
	if (existingBannerFileKey) {
		await storage.deleteFile(existingBannerFileKey);
	}

	const newBannerFileKey = getBannerFileKey(currentHotel.id);

	await storage.uploadFile(bannerFile, newBannerFileKey);

	await HotelModel.updateOne(
		{
			_id: currentHotel._id,
		},
		{
			bannerFileKey: newBannerFileKey,
		},
	);
});
