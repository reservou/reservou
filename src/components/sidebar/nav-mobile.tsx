import type { NavItem } from "@/app/dashboard/layout";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

export function NavMobile({
	navItems,
	pathname,
}: {
	navItems: NavItem[];
	pathname: string;
}) {
	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-background border-t">
			<div className="flex justify-around">
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex flex-col items-center py-2 px-3 text-xs",
							pathname === item.href || pathname?.startsWith(`${item.href}/`)
								? "text-primary"
								: "text-muted-foreground",
						)}
					>
						<item.icon className="h-5 w-5 mb-1" />
						{item.title}
					</Link>
				))}
			</div>
		</div>
	);
}
