import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Building2, Calendar, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HotelPage({
	params: { slug },
}: { params: { slug: string } }) {
	const hotel = {
		id: 1,
		name: "Acme Luxury Resort",
		slug,
		description:
			"Experience luxury like never before at our 5-star resort nestled in the heart of paradise. With stunning ocean views, world-class amenities, and exceptional service, Acme Luxury Resort offers the perfect getaway for those seeking relaxation and adventure. Our spacious rooms feature modern design with local touches, creating a unique atmosphere that blends comfort with authentic charm.",
		location: "Coastal Paradise, Tropical Island",
		rating: 4.8,
		reviewCount: 236,
		amenities: [
			"Free WiFi",
			"Pool",
			"Spa",
			"Restaurant",
			"Gym",
			"Beach Access",
		],
		photos: [
			{
				src: "/outside-pool-view.jpg",
				alt: "Hotel exterior view with palm trees and ocean in background",
			},
			{
				src: "/palm-trees-pool.jpg",
				alt: "Luxury hotel room with king size bed and ocean view",
			},
			{
				src: "/pool-chairs-view.jpg",
				alt: "Hotel swimming pool surrounded by lounge chairs",
			},
			{
				src: "/room.jpg",
				alt: "Hotel restaurant with elegant dining setup",
			},
		],
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			<Card className="border-none shadow-none md:shadow-sm md:border">
				<CardHeader className="pb-4">
					<div className="flex flex-col md:flex-row md:items-center gap-4">
						<div className="flex items-center justify-center bg-primary/10 rounded-full p-3">
							<Building2 className="h-8 w-8 text-primary" />
						</div>
						<div className="space-y-1">
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<CardTitle className="text-2xl md:text-3xl">
									{hotel.name}
								</CardTitle>
								<Badge
									variant="outline"
									className="w-fit text-muted-foreground"
								>
									{hotel.slug}
								</Badge>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<MapPin className="h-4 w-4" />
								<span className="text-sm">{hotel.location}</span>
							</div>
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-primary text-primary" />
								<span className="font-medium">{hotel.rating}</span>
								<span className="text-muted-foreground text-sm">
									({hotel.reviewCount} reviews)
								</span>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					<div>
						<h2 className="text-xl font-semibold mb-2">About</h2>
						<p className="text-muted-foreground">{hotel.description}</p>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-3">Amenities</h2>
						<div className="flex flex-wrap gap-2">
							{hotel.amenities.map((amenity) => (
								<Badge key={amenity} variant="secondary">
									{amenity}
								</Badge>
							))}
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-3">Photos</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{hotel.photos.map((photo) => (
								<div
									key={photo.src + photo.alt}
									className="relative aspect-[4/3] overflow-hidden rounded-lg"
								>
									<Image
										src={photo.src || "/placeholder.svg"}
										alt={photo.alt}
										fill
										className="object-cover transition-transform hover:scale-105"
									/>
								</div>
							))}
						</div>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
					<div className="text-center sm:text-left">
						<p className="text-sm text-muted-foreground">
							Ready to experience luxury?
						</p>
						<p className="font-semibold">Book your stay now!</p>
					</div>
					<Link href={`${slug}/reserve`} className="w-full sm:w-auto ">
						<Button className="w-full sm:w-auto gap-2">
							<Calendar className="h-4 w-4" />
							<span className="font-semibold">Reserve Now</span>
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
