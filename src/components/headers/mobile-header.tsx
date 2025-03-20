import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import type { GetCurrentUserOutput } from "@/src/modules/auth/actions/get-current-user";
import { Home, User } from "lucide-react";
import Image from "next/image";
import { SettingsLink } from "../sidebar/settings-link";
import { SignOutButton } from "../sidebar/sign-out-button";
import { Button } from "../ui/button";
import { ThemeDropdown } from "../ui/theme-dropdown";

export function MobileHeader({
	isMobileMenuOpen,
	setIsMobileMenuOpen,
	user,
}: {
	isMobileMenuOpen: boolean;
	setIsMobileMenuOpen: (open: boolean) => void;
	user: GetCurrentUserOutput | null;
}) {
	return (
		<div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-background border-b">
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					<div className="bg-primary/10 p-2 rounded-md">
						<Home className="h-5 w-5 text-primary" />
					</div>
					<h1 className="font-semibold">Reservou</h1>
				</div>

				<Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
					<DialogTrigger asChild>
						<Button variant="ghost" size="icon">
							<User className="h-5 w-5" />
							<span className="sr-only">User menu</span>
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Conta</DialogTitle>
							<DialogDescription>
								Gerencie suas configurações de conta
							</DialogDescription>
						</DialogHeader>

						<div className="py-4 space-y-4">
							{/* Account Info */}

							{user ? (
								<div className="flex flex-col items-center gap-3">
									<div className="overflow-hidden rounded-full">
										<Image
											src={"/logo.svg"}
											width={64}
											height={64}
											alt="logo"
										/>
									</div>
									<div className="text-center">
										<p className="font-medium">{user?.hotel ?? user?.name}</p>
										<p className="text-sm text-muted-foreground">
											{user?.email}
										</p>
									</div>
								</div>
							) : (
								<p>Não foi possível carregar a sessão</p>
							)}

							<ThemeDropdown variant={"outline"} className="w-full" />
							<SettingsLink variant={"outline"} className="w-full" />
							<SignOutButton className="w-full mt-2" />
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
