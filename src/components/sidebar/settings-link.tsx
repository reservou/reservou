import { cn } from "@/src/lib/utils";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button, type ButtonVariants } from "../ui/button";

export function SettingsLink({
	className,
	variant = "ghost",
}: { className?: string; variant?: ButtonVariants["variant"] }) {
	return (
		<Link href="/dashboard/settings">
			<Button
				variant={variant}
				className={cn("w-full text-center justify-center text-sm", className)}
			>
				<Settings className="mr-2 h-4 w-4" />
				<span>Configurações</span>
			</Button>
		</Link>
	);
}
