"use server";

import { buildAction } from "@/src/lib/action";
import {
	BadRequestError,
	InternalServerError,
	NotFoundError,
} from "@/src/lib/errors";
import { storage } from "@/src/lib/storage";
import { createId } from "@paralleldrive/cuid2";
import { HotelModel } from "../hotel/models/hotel";
import { getCurrentUserHotelOrThrow } from "../hotel/utils/get-current-user-hotel-or-throw";
import {
	MAX_PHOTOS_NUM,
	MAX_PHOTOS_REACHED,
	PHOTO_EXPIRY_MS,
} from "./constants";
import type { Photo, StoredPhoto, UploadedPhoto } from "./types";
import { getPhotoFileKey, isValidImage } from "./utils";

/**
 * Returns the photos of a hotel with signed URLs
 */
export const getHotelPhotos = async (hotelId: string) => {
	const hotel = await HotelModel.findById(hotelId);

	if (!hotel) {
		throw new NotFoundError("Hotel não encontrado");
	}

	const promises = [];

	for (const photo of hotel.photos) {
		promises.push(
			storage.getSignedUrl(photo.fileKey, PHOTO_EXPIRY_MS).then(
				(photoUrl) =>
					({
						id: photo.id,
						alt: photo.alt,
						fileKey: photo.fileKey,
						url: photoUrl,
						fromServer: true,
						hasBeenDeleted: false,
					}) satisfies StoredPhoto,
			),
		);
	}

	return await Promise.all(promises);
};

/**
 * Returns the photos of the authenticated user's hotel
 */
export const getCurrentHotelPhotos = buildAction(async () => {
	const hotel = await getCurrentUserHotelOrThrow();

	const promises = [];

	for (const photo of hotel.photos) {
		promises.push(
			storage.getSignedUrl(photo.fileKey, PHOTO_EXPIRY_MS).then(
				(photoUrl) =>
					({
						id: photo.id,
						alt: photo.alt,
						fileKey: photo.fileKey,
						url: photoUrl,
						fromServer: true,
						hasBeenDeleted: false,
					}) satisfies StoredPhoto,
			),
		);
	}

	return await Promise.all(promises);
});

/**
 * Returns a signed URL for the banner
 */
export const getBannerUrl = buildAction(async (bannerFileKey: string) => {
	return storage.getSignedUrl(bannerFileKey, PHOTO_EXPIRY_MS);
});

/**
 * Update the hotel gallery based on the provided array
 * @param photos - Photos array containing the uploaded photos and deleted photos
 */
export const updateGallery = buildAction(async (photos: Photo[]) => {
	const photosToDelete = photos.filter(
		(photo) => photo.fromServer && photo.hasBeenDeleted,
	);

	const photosToUpload = photos.filter((photo) => !photo.fromServer);

	await Promise.all([
		deletePhotos(photosToDelete.map((p) => p.id)),
		uploadPhotos(photosToUpload),
	]);
});

const uploadPhotos = async (photos: UploadedPhoto[]) => {
	for (const photo of photos) {
		if (!isValidImage(photo.file)) {
			throw new BadRequestError(`Invalid image file for photo ${photo.id}`);
		}
	}

	const currentHotel = await getCurrentUserHotelOrThrow();

	const availableSlots = MAX_PHOTOS_NUM - currentHotel.photos.length;
	if (photos.length > availableSlots) {
		throw new BadRequestError(MAX_PHOTOS_REACHED);
	}

	const uploadedPhotos: StoredPhoto[] = [];
	const photoUpdates = [];

	for (const photo of photos) {
		const fileKey = getPhotoFileKey(currentHotel.id);

		const photoUrl = await storage.uploadFile(photo.file, fileKey);

		photoUpdates.push({
			id: createId(),
			alt: photo.alt,
			fileKey,
		});

		uploadedPhotos.push({
			id: photo.id,
			alt: photo.alt,
			fileKey,
			fromServer: true,
			hasBeenDeleted: false,
			url: photoUrl,
		});
	}

	const { modifiedCount } = await HotelModel.updateOne({
		_id: currentHotel._id,
		$push: {
			photos: {
				$each: photoUpdates,
			},
		},
	});

	if (modifiedCount === 0) {
		// Cleanup uploaded files if database update fails
		await Promise.all(
			photoUpdates.map((photo) => storage.deleteFile(photo.fileKey)),
		);
		throw new InternalServerError("Could not upload photos to hotel document", {
			hotelId: currentHotel.id,
			photoCount: photos.length,
		});
	}
};

const deletePhotos = async (photoIds: string[]) => {
	const currentHotel = await getCurrentUserHotelOrThrow();

	const photosToDelete = photoIds.map((photoId) => {
		const photo = currentHotel.photos.find((p) => p.id === photoId);
		if (!photo) {
			throw new BadRequestError(
				`Não é possível deletar a foto com ID ${photoId}`,
			);
		}
		return photo;
	});

	const { modifiedCount } = await HotelModel.updateOne({
		_id: currentHotel._id,
		$pull: {
			photos: {
				id: { $in: photoIds },
			},
		},
	});

	if (modifiedCount !== photoIds.length) {
		throw new InternalServerError(
			"Could not delete all photos from hotel document",
			{
				hotelId: currentHotel.id,
				photoIds,
				modifiedCount,
			},
		);
	}

	await Promise.all(
		photosToDelete.map((photo) => storage.deleteFile(photo.fileKey)),
	);
};
