// components/ThemeDropdown.tsx
"use client";

import { Button, type ButtonVariants } from "@/src/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDropdown({
	className,
	variant = "ghost",
}: { className?: string; variant?: ButtonVariants["variant"] }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const themeOptions = [
		{ value: "light", label: "Claro", icon: Sun },
		{ value: "dark", label: "Escuro", icon: Moon },
		{ value: "system", label: "Sistema", icon: Laptop },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn("mb-2", className)} asChild>
				<Button variant={variant} className="flex items-center ">
					{theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
					{theme === "light" && <Sun className="mr-2 h-4 w-4" />}
					{theme === "system" && <Laptop className="mr-2 h-4 w-4" />}
					<span>Selecionar Modo</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{themeOptions.map((option) => (
					<DropdownMenuItem
						key={option.value}
						onClick={() => setTheme(option.value)}
						className={cn(
							"flex items-center gap-2",
							theme === option.value && "bg-accent",
						)}
					>
						<option.icon className="mr-2 h-4 w-4" />
						<span>{option.label}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
