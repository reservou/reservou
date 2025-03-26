import type {
	GeneralInfo,
	LocationInfo,
} from "@/app/dashboard/landing-page/types";
import { ArrowRightIcon } from "lucide-react";
import type { Photo as IPhoto } from "../modules/gallery/types";
import { Photo } from "./photo";
import { Button } from "./ui/button";

export type LandingPagePreviewData = {
	generalInfo: GeneralInfo;
	amenities: string[];
	locationInfo: LocationInfo;
	gallery: IPhoto[];
	banner: {
		url: string;
	};
};

export function LandingPagePreview({
	gallery,
	amenities,
	generalInfo,
	locationInfo,
	banner,
}: LandingPagePreviewData) {
	return (
		<div className="border rounded-lg overflow-hidden">
			<div className="p-4 bg-muted flex items-center justify-between">
				<p className="text-sm font-medium">Visualização da Página Inicial</p>
				<Button variant="outline" size="sm" asChild>
					<a href="/" target="_blank" rel="noopener noreferrer">
						Abrir em Nova Aba
						<ArrowRightIcon className="ml-2 h-4 w-4" />
					</a>
				</Button>
			</div>

			<div className="p-6 bg-background">
				<div className="max-w-5xl mx-auto">
					<Photo
						className="aspect-[2/1] mb-8"
						photo={{
							alt: `${generalInfo.name}'s banner`,
							url: banner.url,
						}}
					/>
					<div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
						<div className="space-y-1">
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<h1 className="text-2xl md:text-3xl font-bold">
									{generalInfo.name}
								</h1>
								<div className="px-2 py-0.5 border rounded-full text-sm text-muted-foreground w-fit">
									{generalInfo.slug}
								</div>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
										fill="currentColor"
									/>
								</svg>
								<span className="text-sm">{locationInfo.address}</span>
							</div>
						</div>
					</div>

					<div className="space-y-6 mb-6">
						<div>
							<h2 className="text-xl font-semibold mb-2">Sobre</h2>
							<p className="text-muted-foreground">{generalInfo.description}</p>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-3">Comodidades</h2>
							<div className="flex flex-wrap gap-2">
								{amenities.map((amenity) => (
									<div
										key={amenity}
										className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
									>
										{amenity}
									</div>
								))}
							</div>
						</div>

						<div>
							<h2 className="text-xl font-semibold mb-3">Fotos</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{gallery.map((photo) => (
									<div
										key={photo.id}
										className="relative aspect-[4/3] overflow-hidden rounded-lg"
									>
										<img
											src={photo.url || "/placeholder.svg"}
											alt={photo.alt}
											className="object-cover w-full h-full"
										/>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
						<div className="text-center sm:text-left">
							<p className="text-sm text-muted-foreground">
								Pronto para aproveitar?
							</p>
							<p className="font-semibold">Faça sua reserva agora!</p>
						</div>
						<Button className="w-full sm:w-auto gap-2">
							<svg
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"
									fill="currentColor"
								/>
							</svg>
							Faça sua reserva
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
