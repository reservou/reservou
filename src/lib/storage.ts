"server-only";

import { storage as firebaseStorage } from "@/src/lib/firebase/admin";
import type { Bucket } from "@google-cloud/storage";

interface IStorage {
	uploadFile: (
		filePath: string,
		destination: string,
		metadata?: Record<string, string>,
	) => Promise<string>;
	getSignedUrl: (filePath: string, expiresIn: number) => Promise<string>;
	deleteFile: (filePath: string) => Promise<void>;
}

let bucket: Bucket;

/**
 * Initializes the storage bucket if not already initialized
 */
function getBucket() {
	if (!bucket) {
		bucket = firebaseStorage.bucket();
	}
	return bucket;
}

/**
 * Uploads a file to Firebase Storage
 * @param filePath Local path to the file
 * @param destination Storage destination path
 * @param metadata Optional metadata for the file
 * @returns Promise resolving to the file's storage path
 */
async function uploadFile(
	filePath: string,
	destination: string,
	metadata?: Record<string, string>,
): Promise<string> {
	try {
		const bucket = getBucket();
		const [file] = await bucket.upload(filePath, {
			destination,
			metadata: metadata ? { metadata } : undefined,
		});
		return file.name;
	} catch (error) {
		throw new Error(
			`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Generates a signed URL for a file
 * @param filePath Path to the file in storage
 * @param expiresIn Expiration time in milliseconds
 * @returns Promise resolving to the signed URL
 */
async function getSignedUrl(
	filePath: string,
	expiresIn: number,
): Promise<string> {
	try {
		const bucket = getBucket();
		const [url] = await bucket.file(filePath).getSignedUrl({
			action: "read",
			expires: Date.now() + expiresIn,
		});
		return url;
	} catch (error) {
		throw new Error(
			`Failed to get signed URL: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Deletes a file from storage
 * @param filePath Path to the file in storage
 */
async function deleteFile(filePath: string): Promise<void> {
	try {
		const bucket = getBucket();
		await bucket.file(filePath).delete();
	} catch (error) {
		throw new Error(
			`Failed to delete file: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

export const storage: IStorage = Object.freeze({
	uploadFile,
	getSignedUrl,
	deleteFile,
});
