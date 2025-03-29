"use client";

import type React from "react";

import { MobileHeader } from "@/src/components/headers/mobile-header";
import { DesktopSidebar } from "@/src/components/sidebar/desktop-sidebar";
import { NavMobile } from "@/src/components/sidebar/nav-mobile";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import {
	Bed,
	CalendarClock,
	LayoutDashboard,
	type LucideProps,
	Ticket,
	Wallet,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavItem = {
	title: string;
	href: string;
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
};

const navItems = [
	{
		title: "Quartos",
		href: "/dashboard/quartos",
		icon: Bed,
	},
	{
		title: "Tickets",
		href: "/dashboard/tickets",
		icon: Ticket,
	},
	{
		title: "Landing Page",
		href: "/dashboard/landing-page",
		icon: LayoutDashboard,
	},
	{
		title: "Reservas",
		href: "/dashboard/reservas",
		icon: CalendarClock,
	},
	{
		title: "Carteira",
		href: "/dashboard/carteira",
		icon: Wallet,
	},
];

export default function DashboardLayout({
	children,
}: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	const { user, isLoading } = useCurrentUser();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="p-4 border-t space-y-3 bg-background">
				<div className="flex items-center gap-2 p-2 rounded-md">
					<Skeleton className="h-6 w-6 rounded-full" />
					<div className="space-y-1">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-9 w-full" />
				<Skeleton className="h-9 w-full" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-muted/40 flex">
			<DesktopSidebar user={user} navItems={navItems} pathname={pathname} />
			<MobileHeader
				user={user}
				isMobileMenuOpen={isMobileMenuOpen}
				setIsMobileMenuOpen={setIsMobileMenuOpen}
			/>
			<NavMobile navItems={navItems} pathname={pathname} />
			{/* Main Content */}
			<main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 pb-20 md:pb-8">
				<div className="max-w-7xl mx-auto p-0 xl:px-24">{children}</div>
			</main>
		</div>
	);
}
