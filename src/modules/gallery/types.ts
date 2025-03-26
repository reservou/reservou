export type Photo = StoredPhoto | UploadedPhoto;

export type StoredPhoto = {
	id: string;
	url: string;
	alt: string;
	fileKey: string;
	fromServer: true;
	hasBeenDeleted: boolean;
};

export type UploadedPhoto = {
	id: string;
	alt: string;
	file: File;
	url: string;
	fromServer: false;
};
