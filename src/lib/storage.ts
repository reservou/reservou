"server-only";

import { storage as firebaseStorage } from "@/src/lib/firebase/admin";
import type { Bucket } from "@google-cloud/storage";
import { InternalServerError } from "./errors";

interface IStorage {
	/**
	 * Uploads a file to Firebase Storage from a File, Buffer or ArrayBuffer
	 * @param fileOrBuffer The file or buffer data to upload
	 * @param fileKey - The destination path, the unique identifier for the file
	 * @param options Upload options including contentType and metadata
	 * @returns Promise resolving to the file's storage path
	 */
	uploadFile: (
		fileOrBuffer: File | Buffer | ArrayBuffer,
		fileKey: string,
		options?: {
			contentType?: string;
			metadata?: Record<string, string>;
		},
	) => Promise<string>;

	/**
	 * Generates a signed URL for a file
	 * @param fileKey Path to the file in storage
	 * @param expiresInMs Expiration time in milliseconds
	 * @returns Promise resolving to the signed URL
	 */
	getSignedUrl: (fileKey: string, expiresInMs: number) => Promise<string>;

	/**
	 * Generates a public URL for a file
	 * This assumes the file has been made publicly accessible in Firebase Storage settings
	 * @param fileKey Path to the file in storage
	 * @returns Public URL to the file
	 */
	getFileUrl: (fileKey: string) => string;

	/**
	 * Deletes a file from storage
	 * @param fileKey Path to the file in storage
	 */
	deleteFile: (fileKey: string) => Promise<void>;
}

let bucket: Bucket;

interface SaveOptions {
	contentType?: string;
	metadata?: {
		metadata?: Record<string, string>;
	};
}

/**
 * Initializes the storage bucket if not already initialized
 */
function getBucket() {
	if (!bucket) {
		bucket = firebaseStorage.bucket();
	}
	return bucket;
}

async function uploadFile(
	fileOrBuffer: File | Buffer | ArrayBuffer,
	fileKey: string,
	options?: {
		contentType?: string;
		metadata?: Record<string, string>;
	},
): Promise<string> {
	try {
		const bucket = getBucket();
		let buffer: Buffer;
		let contentType = options?.contentType;

		if (fileOrBuffer instanceof File) {
			const arrayBuffer = await fileOrBuffer.arrayBuffer();
			buffer = Buffer.from(arrayBuffer);
			contentType = contentType || fileOrBuffer.type;
		} else if (fileOrBuffer instanceof ArrayBuffer) {
			buffer = Buffer.from(fileOrBuffer);
		} else {
			buffer = fileOrBuffer;
		}

		const file = bucket.file(fileKey);

		const uploadOptions: SaveOptions = {};
		if (contentType) {
			uploadOptions.contentType = contentType;
		}
		if (options?.metadata) {
			uploadOptions.metadata = { metadata: options.metadata };
		}

		await file.save(buffer, uploadOptions);

		return file.name;
	} catch (error) {
		throw new InternalServerError(
			`Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

async function getSignedUrl(
	fileKey: string,
	expiresInMs: number,
): Promise<string> {
	try {
		const bucket = getBucket();
		const [url] = await bucket.file(fileKey).getSignedUrl({
			action: "read",
			expires: Date.now() + expiresInMs,
		});
		return url;
	} catch (error) {
		throw new InternalServerError(
			`Failed to get signed URL: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

function getFileUrl(fileKey: string): string {
	const bucket = getBucket();
	const bucketName = bucket.name;

	// URL format: https://storage.googleapis.com/BUCKET_NAME/FILE_PATH
	return `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(fileKey)}`;
}

/**
 * Deletes a file from storage
 * @param fileKey Path to the file in storage
 */
async function deleteFile(fileKey: string): Promise<void> {
	try {
		const bucket = getBucket();
		await bucket.file(fileKey).delete();
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new InternalServerError(message);
	}
}

export const storage: IStorage = Object.freeze({
	uploadFile,
	getSignedUrl,
	getFileUrl,
	deleteFile,
});
