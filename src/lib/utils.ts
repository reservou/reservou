import imageCompression from "browser-image-compression";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function compressImage(file: File): Promise<File | null> {
	try {
		const options = {
			maxSizeMB: 1, // Max size of 1MB per photo
			maxWidthOrHeight: 1920, // Resize to max 1920px width or height
			useWebWorker: true, // Offload to web worker for performance
		};
		const compressedFile = await imageCompression(file, options);
		return compressedFile;
	} catch (error) {
		return null;
	}
}
