"use client";

import { uploadBanner } from "@/src/modules/gallery/upload-banner";
import type { Media } from "@/src/modules/gallery/upload-photo";
import { createId } from "@paralleldrive/cuid2";
import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { AnimatedImage, ImageSkeleton } from "../animated-image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type BannerManagerRefProps = {
	getBanner: () => Media | null;
} | null;

export type BannerManagerProps = {
	initialBanner: Media | null;
	ref: React.Ref<BannerManagerRefProps>;
};

export function BannerManager({ initialBanner, ref }: BannerManagerProps) {
	const [banner, setBanner] = React.useState<Media | null>(initialBanner);
	const [uploading, setUploading] = React.useState(false);

	React.useImperativeHandle(ref, () => ({
		getBanner: () => banner,
	}));

	const handleChangeBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		setBanner({
			url: URL.createObjectURL(file),
			alt: file.name,
			fileKey: createId(),
		});

		const output = await uploadBanner(file);
		setUploading(false);

		if (!output.success) {
			toast.error("Erro ao atualizar banner");
			return;
		}

		setBanner({
			alt: output.data.alt,
			url: output.data.url,
			fileKey: output.data.fileKey,
		});

		toast.success("Banner atualizado com sucesso");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Banner Principal</CardTitle>
				<CardDescription>
					Adicione uma imagem de destaque para a parte superior da sua página.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{uploading ? (
					<ImageSkeleton className="aspect-[2/1] mb-4" />
				) : banner ? (
					<AnimatedImage
						className="aspect-[2/1] mb-4"
						url={banner.url}
						alt={banner.alt}
					/>
				) : (
					<div className="relative aspect-[2/1] overflow-hidden rounded-md mb-4">
						<Image
							className="object-cover"
							src={"/placeholder.svg"}
							fill
							alt={"Hotel's banner placeholder"}
						/>
					</div>
				)}

				<div className="flex items-center gap-2">
					<Label htmlFor="banner-upload" className="cursor-pointer">
						<div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-md hover:bg-primary/20 transition-colors">
							<ImagePlusIcon className="h-4 w-4" />
							<span>Alterar Banner</span>
						</div>
						<Input
							id="banner-upload"
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleChangeBanner}
						/>
					</Label>
					<p className="text-xs text-muted-foreground">
						Recomendado: 1200 x 600 pixels
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
