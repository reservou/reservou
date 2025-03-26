import { createId } from "@paralleldrive/cuid2";

/**
 * Check if the file is a supported image format and doesn't exceed the maximum size.
 * @param file - The file to check.
 * @returns True if the file is a supported image format and doesn't exceed the maximum size, false otherwise.
 */
export function isValidImage(file: File): boolean {
	const supportedImageTypes = ["image/jpeg", "image/png", "image/gif"];

	if (!supportedImageTypes.includes(file.type)) return false;

	const maxSize = 5 * 1024 * 1024;
	return file.size <= maxSize;
}

/**
 * Standarize the photo filekeys based on the hotel's id
 * @param hotelId - The id of the hotel.
 * @returns The standardized photo filekey.
 */
export function getPhotoFileKey(hotelId: string) {
	return `hotel/${hotelId}/photos/${createId()}.jpg`;
}

/**
 * Standarize the banner filekeys based on the hotel's id
 * @param hotelId - The id of the hotel.
 * @returns The standardized banner filekey.
 */
export function getBannerFileKey(hotelId: string) {
	return `hotel/${hotelId}/banner/${createId()}.jpg`;
}
