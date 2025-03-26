"use client";

import { createId } from "@paralleldrive/cuid2";
import imageCompression from "browser-image-compression";
import React from "react";
import { toast } from "sonner";
import { ERROR_MESSAGES } from "../constants";
import {
	getCurrentHotelPhotos,
	getHotelPhotos,
	updateGallery,
} from "../modules/gallery/actions";
import {
	MAX_PHOTOS_NUM,
	MAX_PHOTOS_REACHED,
} from "../modules/gallery/constants";
import type {
	Photo,
	StoredPhoto,
	UploadedPhoto,
} from "../modules/gallery/types";

/**
 * Custom hook for managing a hotel photo gallery.
 * Handles photo fetching, adding, editing, deleting, and saving operations.
 */
export function useGallery() {
	const [photos, setPhotos] = React.useState<Photo[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isSaving, setIsSaving] = React.useState(false);
	const [isSaved, setIsSaved] = React.useState(false);
	const [refetchTrigger, setRefetchTrigger] = React.useState(0);
	const [hasChanged, setHasChanged] = React.useState(false);

	const canUpload = filterPhotosToBePersisted(photos).length < MAX_PHOTOS_NUM;

	// biome-ignore lint/correctness/useExhaustiveDependencies: dependency acting as a trigger
	React.useEffect(() => {
		const fetchHotelPhotos = async () => {
			setIsLoading(true);
			const output = await getCurrentHotelPhotos();
			if (output.success) {
				setPhotos(output.data);
			} else {
				toast.error(output.message);
			}
			setIsLoading(false);
		};

		fetchHotelPhotos();
	}, [refetchTrigger]);

	const handleSave = async () => {
		setIsSaving(true);
		const output = await updateGallery(photos);
		setRefetchTrigger((prev) => prev + 1);
		setIsSaving(false);

		if (output.success) {
			setIsSaved(true);
			setTimeout(() => setIsSaved(false), 5 * 1000);
			setHasChanged(false);
		} else toast.error(output.message);
	};

	const handleDeletePhoto = (id: string) => {
		const targettedPhoto = photos.find((photo) => photo.id === id);
		if (!targettedPhoto) return;

		if (targettedPhoto.fromServer === true) {
			setPhotos([
				...photos.map((photo) =>
					photo.id === targettedPhoto.id
						? ({
								...targettedPhoto,
								hasBeenDeleted: true,
							} satisfies StoredPhoto)
						: photo,
				),
			]);
			setHasChanged(true);
		}

		if (targettedPhoto.fromServer === false) {
			setPhotos([...photos.filter((photo) => photo.id !== targettedPhoto.id)]);
		}
	};

	const handleEditPhoto = async (
		id: string,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const target = e.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) {
			toast("Please select a file");
			return;
		}

		const file = target.files[0];
		const compressedFile = await compressImage(file);
		const url = URL.createObjectURL(compressedFile);

		const uploadedPhoto: UploadedPhoto = {
			alt: "new Photo",
			id: createId(),
			fromServer: false,
			url,
			file: compressedFile, // Use compressed file
		};

		const targettedPhoto = photos.find((photo) => photo.id === id);

		if (!targettedPhoto) {
			toast("A foto que você tentou editar não foi encontrada");
			return;
		}

		// Mark the stored photo as deleted
		if (targettedPhoto.fromServer === true) {
			setPhotos([
				...photos.map((photo) => {
					if (photo.id === targettedPhoto.id) {
						return {
							...targettedPhoto,
							hasBeenDeleted: true,
						} satisfies StoredPhoto;
					}
					return photo;
				}),
			]);
			setHasChanged(true);
		}

		// Replace the uploaded photo since it was not sent to server
		if (targettedPhoto.fromServer === false) {
			setPhotos([
				...photos.map((photo) =>
					photo.id === targettedPhoto.id ? uploadedPhoto : photo,
				),
			]);
		}

		setPhotos((prev) => [...prev, uploadedPhoto]);
		setHasChanged(true);

		target.value = "";
	};

	const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!canUpload) {
			toast.warning(MAX_PHOTOS_REACHED);
			return;
		}

		if (!e.target.files || e.target.files.length === 0) {
			toast("Por favor selecione uma foto");
			return;
		}

		const file = e.target.files[0];
		const compressedFile = await compressImage(file);
		const url = URL.createObjectURL(compressedFile);

		const uploadedPhoto: UploadedPhoto = {
			alt: "new Photo",
			id: createId(),
			fromServer: false,
			url,
			file: compressedFile,
		};

		setPhotos([...photos, uploadedPhoto]);
		setHasChanged(true);

		e.target.value = "";
	};

	return {
		photos,
		isLoading,
		isSaving,
		isSaved,
		canUpload,
		hasChanged,
		handleAddPhoto,
		handleEditPhoto,
		handleDeletePhoto,
		handleSave,
	};
}

function filterPhotosToBePersisted(photos: Photo[]) {
	return photos.filter(
		(photo) => !photo.fromServer || (photo.fromServer && !photo.hasBeenDeleted),
	);
}

async function compressImage(file: File): Promise<File> {
	try {
		const options = {
			maxSizeMB: 1, // Max size of 1MB per photo
			maxWidthOrHeight: 1920, // Resize to max 1920px width or height
			useWebWorker: true, // Offload to web worker for performance
		};
		const compressedFile = await imageCompression(file, options);
		return compressedFile;
	} catch (error) {
		toast.error("Failed to compress image");
		console.error(error);
		return file;
	}
}
