"use client";

import { cn } from "@/src/lib/utils";
import * as DateFNS from "date-fns";
import {
	BedDouble,
	CalendarIcon,
	ChevronLeft,
	Coffee,
	Tv,
	Users,
	Wifi,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Calendar } from "@/src/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/src/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Slider } from "@/src/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

/**
 * @todo Implement this abstraction to come from the API
 */
const roomTypes = [
	{ id: "all", name: "All Rooms" },
	{ id: "standard", name: "Standard Room" },
	{ id: "deluxe", name: "Deluxe Room" },
	{ id: "suite", name: "Suite" },
	{ id: "family", name: "Family Room" },
];

/**
 * @todo Implement this abstraction to come from the API
 */
const roomsData = [
	{
		id: 1,
		name: "Standard Ocean View",
		type: "standard",
		price: 199,
		image: "/room-1.jpg",
		tags: ["Ocean View", "King Bed"],
		amenities: ["wifi", "tv", "coffee"],
		capacity: 2,
		available: true,
	},
	{
		id: 2,
		name: "Deluxe Mountain View",
		type: "deluxe",
		price: 299,
		image: "/room-2.jpg",
		tags: ["Mountain View", "King Bed"],
		amenities: ["wifi", "tv", "coffee"],
		capacity: 2,
		available: true,
	},
	{
		id: 3,
		name: "Executive Suite",
		type: "suite",
		price: 499,
		image: "/room-3.jpg",
		tags: ["Ocean View", "King Bed", "Living Area"],
		amenities: ["wifi", "tv", "coffee"],
		capacity: 2,
		available: true,
	},
	{
		id: 4,
		name: "Family Room",
		type: "family",
		price: 399,
		image: "/room-4.jpg",
		tags: ["Garden View", "2 Queen Beds"],
		amenities: ["wifi", "tv", "coffee"],
		capacity: 4,
		available: true,
	},
	{
		id: 5,
		name: "Standard Garden View",
		type: "standard",
		price: 179,
		image: "/room-5.jpg",
		tags: ["Garden View", "Queen Bed"],
		amenities: ["wifi", "tv"],
		capacity: 2,
		available: true,
	},
	{
		id: 6,
		name: "Deluxe Ocean Suite",
		type: "suite",
		price: 599,
		image: "/room-6.jpg",
		tags: ["Ocean View", "King Bed", "Balcony"],
		amenities: ["wifi", "tv", "coffee"],
		capacity: 2,
		available: false,
	},
];

const minPrice = Math.min(...roomsData.map((room) => room.price));
const maxPrice = Math.max(...roomsData.map((room) => room.price));

export default function ReservePage({
	params,
}: { params: React.Usable<{ slug: string }> }) {
	const { slug } = React.use(params);
	const [roomType, setRoomType] = useState("all");
	const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
	const [dateRange, setDateRange] = useState<{
		from: Date;
		to: Date;
	}>({
		from: new Date(),
		to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
	});

	const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
	const [filteredRooms, setFilteredRooms] = useState(roomsData);

	React.useEffect(() => {
		let result = roomsData;

		if (roomType !== "all") {
			result = result.filter((room) => room.type === roomType);
		}

		result = result.filter(
			(room) =>
				room.price >= priceRange[0] &&
				room.price <= priceRange[1] &&
				room.available,
		);

		setFilteredRooms(result);
	}, [roomType, priceRange]);

	const handleRoomSelect = (roomId: number) => {
		setSelectedRoom(roomId === selectedRoom ? null : roomId);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col gap-8">
				<div className="flex items-center gap-4">
					<Link href={`/${slug}`}>
						<Button variant="ghost" size="icon" className="rounded-full">
							<ChevronLeft className="h-5 w-5" />
							<span className="sr-only">Back</span>
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl font-bold">Reserve a Room</h1>
						<p className="text-muted-foreground">Acme Luxury Resort</p>
					</div>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					<div className="space-y-2">
						<label htmlFor="date-picker" className="text-sm font-medium">
							Check-in / Check-out
						</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id="date-picker"
									variant="outline"
									className={cn(
										"w-full justify-start text-left font-normal",
										!dateRange.from && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{dateRange.from ? (
										dateRange.to ? (
											<>
												{DateFNS.format(dateRange.from, "MMM d, yyyy")} -{" "}
												{DateFNS.format(dateRange.to, "MMM d, yyyy")}
											</>
										) : (
											DateFNS.format(dateRange.from, "MMM d, yyyy")
										)
									) : (
										"Select dates"
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									initialFocus
									mode="range"
									defaultMonth={dateRange.from}
									selected={{
										from: dateRange.from,
										to: dateRange.to,
									}}
									onSelect={(range) => {
										setDateRange({
											from: range?.from ?? dateRange.from,
											to: range?.to ?? dateRange.to,
										});
									}}
									numberOfMonths={2}
								/>
							</PopoverContent>
						</Popover>
					</div>

					<div className="space-y-2">
						<label htmlFor="room-type-select" className="text-sm font-medium">
							Room Type
						</label>
						<Select value={roomType} onValueChange={setRoomType}>
							<SelectTrigger id="room-type-select">
								<SelectValue placeholder="Select room type" />
							</SelectTrigger>
							<SelectContent>
								{roomTypes.map((type) => (
									<SelectItem key={type.id} value={type.id}>
										{type.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between">
							<label
								htmlFor="price-range-slider"
								className="text-sm font-medium"
							>
								Price Range
							</label>
							<span className="text-sm text-muted-foreground">
								${priceRange[0]} - ${priceRange[1]}
							</span>
						</div>
						<Slider
							id="price-range-slider"
							defaultValue={[minPrice, maxPrice]}
							max={maxPrice}
							min={minPrice}
							step={10}
							value={priceRange}
							onValueChange={setPriceRange}
							className="py-4"
						/>
					</div>
				</div>

				<div className="text-sm text-muted-foreground">
					{filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"}{" "}
					available
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredRooms.map((room) => (
						<Card
							key={room.id}
							className={cn(
								"cursor-pointer py-0 overflow-hidden transition-all hover:border-primary",
								selectedRoom === room.id &&
									"border-primary ring-1 ring-primary",
							)}
							onClick={() => handleRoomSelect(room.id)}
						>
							<div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
								<Image
									src={room.image || "/placeholder.svg"}
									alt={room.name}
									fill
									className="object-cover"
								/>
							</div>
							<CardContent className="p-4">
								<div className="flex justify-between items-start mb-2">
									<h3 className="font-semibold">{room.name}</h3>
									<Badge
										variant="outline"
										className="bg-primary/10 text-primary"
									>
										${room.price}/night
									</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-3">
									{room.tags.map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="font-normal"
										>
											{tag}
										</Badge>
									))}
								</div>
								<div className="flex items-center gap-3 text-muted-foreground">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													<span className="text-xs">{room.capacity}</span>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>Max {room.capacity} guests</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>

									<Separator orientation="vertical" className="h-4" />

									<div className="flex gap-2">
										{room.amenities.includes("wifi") && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														<Wifi className="h-4 w-4" />
													</TooltipTrigger>
													<TooltipContent>
														<p>Free WiFi</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
										{room.amenities.includes("tv") && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														<Tv className="h-4 w-4" />
													</TooltipTrigger>
													<TooltipContent>
														<p>TV</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
										{room.amenities.includes("coffee") && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														<Coffee className="h-4 w-4" />
													</TooltipTrigger>
													<TooltipContent>
														<p>Coffee Maker</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
								</div>
							</CardContent>
							<CardFooter className="p-4 pt-0 flex justify-between items-center">
								<div className="flex items-center gap-2">
									<BedDouble className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground capitalize">
										{room.type}
									</span>
								</div>
								{selectedRoom === room.id && (
									<Badge className="bg-primary text-primary-foreground">
										Selected
									</Badge>
								)}
							</CardFooter>
						</Card>
					))}
				</div>

				{filteredRooms.length === 0 && (
					<div className="text-center py-12">
						<h3 className="text-lg font-medium mb-2">No rooms available</h3>
						<p className="text-muted-foreground">
							Try adjusting your filters to find available rooms.
						</p>
					</div>
				)}

				<div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-6">
					<div>
						{selectedRoom ? (
							<div>
								<h3 className="font-medium">
									{roomsData.find((r) => r.id === selectedRoom)?.name}
								</h3>
								<p className="text-muted-foreground">
									${roomsData.find((r) => r.id === selectedRoom)?.price} per
									night
								</p>
							</div>
						) : (
							<p className="text-muted-foreground">Select a room to continue</p>
						)}
					</div>
					<Button
						size="lg"
						disabled={!selectedRoom}
						className="w-full md:w-auto"
					>
						Complete Reservation
					</Button>
				</div>
			</div>
		</div>
	);
}
