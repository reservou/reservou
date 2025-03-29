"use client";

import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";
import { cn } from "../lib/utils";
import { Loading } from "./animations/loading";
import { Skeleton } from "./ui/skeleton";

export function ImageSkeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"relative aspect-[4/3] overflow-hidden rounded-md",
				className,
			)}
		>
			<Skeleton className="absolute inset-0 bg-muted" />
		</div>
	);
}

export type AnimatedImageProps = {
	url: string;
	alt: string;
	className?: string;
};

export function AnimatedImage({ url, alt, className }: AnimatedImageProps) {
	const [isLoading, setIsLoading] = React.useState(true);
	const isLocal = url.startsWith("/");
	const Comp = isLocal ? Image : CldImage;

	return (
		<div
			className={cn(
				"relative aspect-[4/3] overflow-hidden rounded-md",
				className,
			)}
		>
			{isLoading && <Skeleton className="absolute inset-0 bg-muted" />}
			<Comp
				src={url}
				alt={alt}
				width={1200}
				height={900}
				className={cn(
					"object-cover w-full h-full transition-opacity duration-300",
					isLoading ? "blud-md" : "blur-none",
				)}
				onLoad={() => setIsLoading(false)}
				onError={() => setIsLoading(false)}
			/>
		</div>
	);
}
