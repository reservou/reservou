"use client";

import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import {
	Building2,
	Calendar,
	CheckCircle2,
	Copy,
	CreditCard,
	Download,
	Printer,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/src/components/ui/tooltip";

/**
 * @todo Implement this abstract to come from the API
 */
const reservationData = {
	id: "RZ-583921",
	status: "confirmed",
	guest: {
		name: "John Smith",
		email: "john.smith@example.com",
		phone: "+1 (555) 123-4567",
	},
	hotel: {
		name: "Acme Luxury Resort",
		address: "Coastal Paradise, Tropical Island",
		phone: "+1 (555) 987-6543",
		email: "reservations@acmeluxury.com",
		logo: "/placeholder.svg",
		image: "/room-1.jpg",
	},
	room: {
		name: "Deluxe Ocean Suite",
		type: "suite",
		amenities: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Free WiFi"],
	},
	dates: {
		checkIn: new Date("2025-04-15T15:00:00"),
		checkOut: new Date("2025-04-20T11:00:00"),
	},
	guests: {
		adults: 2,
		children: 0,
	},
	payment: {
		method: "Credit Card",
		total: 3294.5,
		currency: "USD",
		status: "paid",
		date: new Date("2024-03-12T14:30:00"),
	},
	qrCode: "/qrcode.svg?height=200&width=200",
	createdAt: new Date("2024-03-12T14:35:00"),
};

const getStatusBadge = (status: string) => {
	switch (status) {
		case "confirmed":
			return {
				label: "Confirmed",
				variant: "outline",
				className: "border-primary text-primary",
			};
		case "checked-in":
			return {
				label: "Checked In",
				variant: "outline",
				className: "border-green-500 text-green-500",
			};
		case "completed":
			return {
				label: "Completed",
				variant: "outline",
				className: "border-blue-500 text-blue-500",
			};
		case "cancelled":
			return {
				label: "Cancelled",
				variant: "outline",
				className: "border-destructive text-destructive",
			};
		default:
			return { label: "Unknown", variant: "outline", className: "" };
	}
};

export default function TicketPage() {
	const [copied, setCopied] = useState(false);
	const ticketRef = useRef<HTMLDivElement>(null);

	const statusBadge = getStatusBadge(reservationData.status);

	const nights = Math.ceil(
		(reservationData.dates.checkOut.getTime() -
			reservationData.dates.checkIn.getTime()) /
			(1000 * 60 * 60 * 24),
	);

	const handleCopyId = () => {
		navigator.clipboard.writeText(reservationData.id);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handlePrint = () => {
		window.print();
	};

	const handleDownload = () => {
		alert("Downloading ticket as PDF...");
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-2xl">
			<div className="flex flex-col gap-6">
				{/* Header with navigation */}
				<div className="flex justify-between items-center">
					<Link href="/">
						<Button variant="ghost">Back to Home</Button>
					</Link>
					<div className="flex gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={handlePrint}
										className="print:hidden"
									>
										<Printer className="h-4 w-4" />
										<span className="sr-only">Print</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Print ticket</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={handleDownload}
										className="print:hidden"
									>
										<Download className="h-4 w-4" />
										<span className="sr-only">Download</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Download as PDF</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>

				{/* Ticket card */}
				<Card className="overflow-hidden border-2" ref={ticketRef}>
					{/* Ticket header */}
					<div className="bg-primary/10 p-6 relative">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-3">
								<div className="relative h-12 w-12 overflow-hidden rounded-md">
									<Image
										src={reservationData.hotel.logo || "/placeholder.svg"}
										alt={reservationData.hotel.name}
										fill
										className="object-cover"
									/>
								</div>
								<div>
									<h1 className="text-xl font-bold">
										{reservationData.hotel.name}
									</h1>
									<p className="text-sm text-muted-foreground">
										{reservationData.hotel.address}
									</p>
								</div>
							</div>
							<Badge
								variant="outline"
								className={cn(
									"print:border-black print:text-black",
									statusBadge.className,
								)}
							>
								{statusBadge.label}
							</Badge>
						</div>

						<div className="absolute -left-4 -bottom-4 h-8 w-8 rounded-full bg-background" />
						<div className="absolute -right-4 -bottom-4 h-8 w-8 rounded-full bg-background" />
					</div>

					<CardContent className="p-6 space-y-6">
						{/* Reservation ID and QR code */}
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm text-muted-foreground">Reservation ID</p>
								<div className="flex items-center gap-2">
									<p className="text-xl font-mono font-bold">
										{reservationData.id}
									</p>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 rounded-full print:hidden"
										onClick={handleCopyId}
									>
										{copied ? (
											<CheckCircle2 className="h-3 w-3 text-primary" />
										) : (
											<Copy className="h-3 w-3" />
										)}
										<span className="sr-only">Copy ID</span>
									</Button>
								</div>
							</div>
							<div className="relative h-24 w-24 print:h-32 print:w-32">
								<Image
									src={reservationData.qrCode || "/placeholder.svg"}
									alt="QR Code"
									fill
									className="object-contain"
								/>
							</div>
						</div>

						<Separator />

						{/* Guest information */}
						<div>
							<h2 className="font-semibold mb-2">Guest Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Name</p>
									<p className="font-medium">{reservationData.guest.name}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Contact</p>
									<p className="font-medium">{reservationData.guest.phone}</p>
								</div>
							</div>
						</div>

						<Separator />

						{/* Stay details */}
						<div>
							<h2 className="font-semibold mb-2">Stay Details</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-primary mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Check-in</p>
											<p className="font-medium">
												{format(
													reservationData.dates.checkIn,
													"EEE, MMM d, yyyy",
												)}
											</p>
											<p className="text-sm">
												After {format(reservationData.dates.checkIn, "h:mm a")}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-primary mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Check-out</p>
											<p className="font-medium">
												{format(
													reservationData.dates.checkOut,
													"EEE, MMM d, yyyy",
												)}
											</p>
											<p className="text-sm">
												Before{" "}
												{format(reservationData.dates.checkOut, "h:mm a")}
											</p>
										</div>
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<Building2 className="h-5 w-5 text-primary mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Room</p>
											<p className="font-medium">{reservationData.room.name}</p>
											<div className="flex flex-wrap gap-1 mt-1">
												{reservationData.room.amenities.map((amenity) => (
													<Badge
														key={amenity}
														variant="secondary"
														className="text-xs font-normal"
													>
														{amenity}
													</Badge>
												))}
											</div>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Users className="h-5 w-5 text-primary mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Guests</p>
											<p className="font-medium">
												{reservationData.guests.adults}{" "}
												{reservationData.guests.adults === 1
													? "adult"
													: "adults"}
												{reservationData.guests.children > 0 &&
													`, ${reservationData.guests.children} ${reservationData.guests.children === 1 ? "child" : "children"}`}
											</p>
											<p className="text-sm">
												{nights} {nights === 1 ? "night" : "nights"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<Separator />

						{/* Payment information */}
						<div>
							<h2 className="font-semibold mb-2">Payment Information</h2>
							<div className="flex items-start gap-3">
								<CreditCard className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<div className="flex items-center gap-2">
										<p className="font-medium">
											{reservationData.payment.method}
										</p>
										<Badge variant="outline" className="text-xs">
											{reservationData.payment.status.toUpperCase()}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										Total: {reservationData.payment.currency} $
										{reservationData.payment.total.toFixed(2)}
									</p>
									<p className="text-xs text-muted-foreground">
										Paid on{" "}
										{format(
											reservationData.payment.date,
											"MMM d, yyyy 'at' h:mm a",
										)}
									</p>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
							<p>Present this ticket upon arrival at the hotel.</p>
							<p className="mt-1">
								For assistance, contact {reservationData.hotel.phone} or{" "}
								{reservationData.hotel.email}
							</p>
							<div className="mt-2 flex items-center justify-center gap-1">
								<p>Booked via</p>
								<span className="font-semibold text-primary">reservou</span>
								<p>on {format(reservationData.createdAt, "MMM d, yyyy")}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
