import { cn } from "@/src/lib/utils";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	title: "Rezervou",
	description: "Reservation platform for the modern age",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(montserrat.className, "bg-background text-foreground")}
			>
				{children}
			</body>
		</html>
	);
}
