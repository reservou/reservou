"use client";

import Image from "next/image";
import React from "react";
import { cn } from "../lib/utils";
import { Loading } from "./animations/loading";

export function Photo({
	photo,
	className,
}: {
	photo: {
		url: string;
		alt: string;
	};
	className?: string;
}) {
	const [isLoading, setIsLoading] = React.useState(true);

	return (
		<div
			className={cn(
				"relative aspect-[4/3] overflow-hidden rounded-md",
				className,
			)}
		>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-muted">
					<Loading />
				</div>
			)}
			<Image
				src={photo.url || "/placeholder.svg"}
				alt={photo.alt}
				fill
				className={cn(
					"object-cover transition-opacity duration-500",
					isLoading ? "opacity-0" : "opacity-100",
				)}
				onLoad={() => setIsLoading(false)}
				onError={() => setIsLoading(false)}
			/>
		</div>
	);
}
