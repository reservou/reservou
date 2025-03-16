import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";
import { cn } from "@/src/lib/utils";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	subsets: ["latin"],
	variable: "--font-montserrat",
});

export const metadata: Metadata = {
	title: {
		default: "Reservou",
		template: "%s | Reservou",
	},
	description: "Reservation platform for the modern age",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					montserrat.className,
					"min-h-screen bg-background font-sans antialiased",
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<div className="relative flex min-h-screen flex-col">
						<main className="flex-1">{children}</main>
					</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
