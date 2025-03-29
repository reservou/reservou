"server-only";

import cloudinary, {
	type UploadApiErrorResponse,
	type UploadApiResponse,
} from "cloudinary";
import { getEnv } from "../env";
import { InternalServerError } from "./errors";

cloudinary.v2.config({
	cloud_name: getEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
	api_key: getEnv("CLOUDINARY_API_KEY"),
	api_secret: getEnv("CLOUDINARY_API_SECRET"),
});

type UploadResult = { fileKey: string; url: string };

async function upload(file: File, folder: string): Promise<UploadResult> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const uploadResult: UploadApiResponse | UploadApiErrorResponse =
		await new Promise((resolve, reject) => {
			cloudinary.v2.uploader
				.upload_stream(
					{
						folder,
						transformation: [
							{ quality: "auto" },
							{ fetch_format: "auto" },
							{ width: 1200, crop: "limit" },
						],
					},
					(error, result) => {
						if (error || !result) reject(error);
						else resolve(result);
					},
				)
				.end(buffer);
		});

	if ("message" in uploadResult) {
		throw new InternalServerError(
			`Upload to cloudinary failed: ${uploadResult.message}`,
		);
	}

	return {
		fileKey: uploadResult.public_id,
		url: uploadResult.secure_url,
	};
}

async function del(fileKey: string): Promise<void> {
	const result = await cloudinary.v2.uploader.destroy(fileKey);
	if (result.result !== "ok") {
		throw new InternalServerError("Could not delete photo from cloudinary", {
			result,
			fileKey,
		});
	}
}

export const mediaManager = Object.freeze({
	upload,
	delete: del,
});
