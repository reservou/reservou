"use server";

import { buildAction } from "@/src/lib/action";
import { BadRequestError } from "@/src/lib/errors";
import { mediaManager } from "@/src/lib/media-manager";
import { HotelModel } from "../hotel/models/hotel";
import { getCurrentUserHotelOrThrow } from "../hotel/utils/get-current-user-hotel-or-throw";
import { MAX_PHOTOS_REACHED } from "./constants";

export type Media = {
	url: string;
	alt: string;
	fileKey: string;
};

/**
 * Server action for uploading a single image to the hotel's gallery
 */
export const uploadPhoto = buildAction(async (file: File): Promise<Media> => {
	const hotel = await getCurrentUserHotelOrThrow();

	if (hotel.photos.length >= 6) {
		throw new BadRequestError(MAX_PHOTOS_REACHED);
	}

	const { fileKey, url } = await mediaManager.upload(
		file,
		`hotels/${hotel.id}/gallery`,
	);

	await HotelModel.updateOne(
		{
			_id: hotel._id,
		},
		{
			$push: {
				photos: {
					fileKey,
					url,
				},
			},
		},
	);

	return { url, fileKey, alt: "" };
});

/**
 * Server action for updating a photo in the hotel's gallery
 */
export const updatePhoto = buildAction(
	async (fileKey: string, file: File): Promise<Media> => {
		const hotel = await getCurrentUserHotelOrThrow();

		if (!hotel.photos.find((photo) => photo.fileKey === fileKey)) {
			throw new BadRequestError("Foto não encontrada");
		}

		await mediaManager.delete(fileKey);
		const { fileKey: newFileKey, url: newUrl } = await mediaManager.upload(
			file,
			`hotels/${hotel.id}/gallery`,
		);

		await HotelModel.updateOne(
			{ _id: hotel._id },
			{
				$set: {
					"photos.$[elem]": { fileKey: newFileKey, url: newUrl },
				},
			},
			{
				arrayFilters: [{ "elem.fileKey": fileKey }],
			},
		);

		return { url: newUrl, fileKey: newFileKey, alt: "" };
	},
);

/**
 * Server action for deleting a photo from the hotel's gallery
 */
export const deletePhoto = buildAction(async (fileKey: string) => {
	const hotel = await getCurrentUserHotelOrThrow();

	if (!hotel.photos.find((photo) => photo.fileKey === fileKey)) {
		throw new BadRequestError("Foto não encontrada");
	}

	await mediaManager.delete(fileKey);

	await HotelModel.updateOne(
		{
			_id: hotel._id,
		},
		{
			$pull: {
				photos: {
					fileKey,
				},
			},
		},
	);

	return { fileKey };
});

export const updateBanner = buildAction(async (file: File) => {
	const hotel = await getCurrentUserHotelOrThrow();

	if (hotel.banner?.url) {
		await mediaManager.delete(hotel.banner.url);
	}

	const { url, fileKey } = await mediaManager.upload(
		file,
		`hotels/${hotel.id}/gallery`,
	);

	await HotelModel.updateOne(
		{
			_id: hotel._id,
		},
		{
			banner: {
				url,
				fileKey,
			},
		},
	);

	return { url, fileKey };
});
