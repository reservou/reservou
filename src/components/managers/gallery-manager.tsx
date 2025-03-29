"use client";

import { MAX_PHOTOS_NUM } from "@/src/modules/gallery/constants";
import {
	type Media,
	deletePhoto,
	updatePhoto,
	uploadPhoto,
} from "@/src/modules/gallery/upload-photo";
import { createId } from "@paralleldrive/cuid2";
import { ImageUpIcon, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { AnimatedImage, ImageSkeleton } from "../animated-image";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type GalleryManagerRefProps = {
	getPhotos: () => Media[];
} | null;

export type GalleryManagerProps = {
	initialPhotos: { fileKey: string; url: string; alt: string }[];
	ref: React.Ref<GalleryManagerRefProps>;
};

export type UploadingProcess = { id: string };

export default function GalleryManager({
	initialPhotos,
	ref,
}: GalleryManagerProps) {
	const [uploadingProcesses, setUploadingProcesses] = React.useState<
		UploadingProcess[]
	>([]);
	const [photos, setPhotos] = React.useState(initialPhotos);
	const canUpload = photos.length + uploadingProcesses.length < MAX_PHOTOS_NUM;

	React.useImperativeHandle(ref, () => ({
		getPhotos: () => photos,
	}));

	const handleDeletePhoto = async (fileKey: string) => {
		setPhotos((prev) => prev.filter((photo) => photo.fileKey !== fileKey));

		const output = await deletePhoto(fileKey);
		if (!output.success) {
			toast.error(output.message);
			return;
		}

		toast.success("Alterações na galeria salvas");
	};

	const handleEditPhoto = async (
		fileKey: string,
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		const id = createId();

		setUploadingProcesses((prev) => [
			...prev,
			{ id } satisfies UploadingProcess,
		]);
		const output = await updatePhoto(fileKey, file);

		setUploadingProcesses((prev) =>
			prev.filter((process) => process.id !== id),
		);

		if (!output.success) {
			toast.error(output.message);
			return;
		}

		setPhotos((prev) =>
			prev.map((photo) => (photo.fileKey === fileKey ? output.data : photo)),
		);

		toast.success("Alterações na galeria salvas");
	};

	const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		const id = createId();
		const previewUrl = URL.createObjectURL(file);

		setUploadingProcesses((prev) => [
			...prev,
			{ id } satisfies UploadingProcess,
		]);
		const output = await uploadPhoto(file);

		setUploadingProcesses((prev) =>
			prev.filter((process) => process.id !== id),
		);

		if (output.error) {
			toast.error(output.message);
			return;
		}

		setPhotos((prev) => [
			...prev,
			{
				alt: output.data.alt,
				fileKey: output.data.fileKey,
				url: previewUrl,
			},
		]);

		toast.success("Alterações na galeria salvas");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Fotos</CardTitle>
				<CardDescription>
					Adicione fotos do seu hotel para exibir na página inicial.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
					{photos.map((photo) => (
						<figure key={photo.fileKey} className="relative group">
							<AnimatedImage url={photo.url} alt={photo.alt} />
							<figcaption className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
								<Label
									htmlFor={`photo-edit-${photo.fileKey}`}
									className="cursor-pointer"
								>
									<div className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors">
										<PencilIcon className="h-4 w-4" />
									</div>
									<Input
										id={`photo-edit-${photo.fileKey}`}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) => handleEditPhoto(photo.fileKey, e)}
									/>
								</Label>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="destructive"
											size="icon"
											className="rounded-full h-8 w-8 p-0"
										>
											<TrashIcon className="h-4 w-4" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Excluir Foto</AlertDialogTitle>
											<AlertDialogDescription>
												Tem certeza que deseja excluir esta foto? Esta ação não
												pode ser desfeita.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => handleDeletePhoto(photo.fileKey)}
											>
												Excluir
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</figcaption>
						</figure>
					))}
					{uploadingProcesses.map(({ id }) => (
						<ImageSkeleton key={id} />
					))}
					{canUpload && (
						<Label
							htmlFor="add-photo"
							className="cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-md aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
						>
							<ImageUpIcon className="h-8 w-8 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">
								Adicionar Foto
							</span>
							<Input
								id="add-photo"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleAddPhoto}
							/>
						</Label>
					)}
				</section>
			</CardContent>
		</Card>
	);
}
