import type { NavItem } from "@/app/dashboard/layout";
import type { GetCurrentUserOutput } from "@/src/actions/get-current-user";
import { cn } from "@/src/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeDropdown } from "../ui/theme-dropdown";
import { SettingsLink } from "./settings-link";
import { SignOutButton } from "./sign-out-button";

export function DesktopSidebar({
	navItems,
	pathname,
	user,
}: {
	navItems: NavItem[];
	pathname: string;
	user: GetCurrentUserOutput | null;
}) {
	return (
		<aside className="hidden md:flex w-64 flex-col bg-card border-r h-screen sticky top-0">
			<div className="flex items-center p-6 gap-2 border-b">
				<div className="overflow-hidden rounded-md">
					<Image src="/logo.svg" width={32} height={32} alt="logo" />
				</div>
				<div>
					<h1 className="font-semibold">Reservou</h1>
					<p className="text-xs text-muted-foreground">Hotel Dashboard</p>
				</div>
			</div>

			<nav className="flex-1 p-4 space-y-1">
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
							pathname === item.href || pathname?.startsWith(`${item.href}/`)
								? "bg-primary/10 text-primary font-medium"
								: "text-muted-foreground hover:bg-muted",
						)}
					>
						<item.icon className="h-4 w-4" />
						{item.title}
					</Link>
				))}
			</nav>

			<div className="p-4 border-t space-y-4 bg-background">
				{!user ? (
					<p className="text-sm text-destructive">Erro ao carregar usuário</p>
				) : (
					<div className="flex items-center gap-2 p-2 rounded-md">
						<div className="bg-primary/10 p-1 rounded-full">
							<User className="h-4 w-4 text-primary" />
						</div>
						<div className="text-left">
							<p className="text-sm font-medium text-foreground">
								{user?.name || "Acme Hotel"}
							</p>
							<p className="text-xs text-muted-foreground">
								{user?.email || "admin@acme.com"}
							</p>
						</div>
					</div>
				)}

				<ThemeDropdown />
				<SettingsLink className="w-fit text-start mb-2" />
				<SignOutButton variant={"ghost"} />
			</div>
		</aside>
	);
}
