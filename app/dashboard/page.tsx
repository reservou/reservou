"use client";

import { useCurrentUser } from "@/src/hooks/use-current-user";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
	const { user, isLoading, isError, errorMessage } = useCurrentUser();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex min-h-screen items-center justify-center text-center">
				<div>
					<h1 className="text-2xl font-semibold text-destructive-foreground">
						Ocorreu um erro inesperado
					</h1>
					<p className="mt-2 text-muted-foreground">{errorMessage}</p>
					<p className="mt-4">
						<a href="/sign-in" className="text-primary underline">
							Faça login novamente
						</a>
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8">
			<h1 className="text-3xl font-bold">
				Bem-vindo ao Dashboard, {user?.name}!
			</h1>
			<div className="mt-4 space-y-2">
				<p>
					<strong>Email:</strong> {user?.email}
				</p>
				<p>
					<strong>Role:</strong> {user?.role}
				</p>
				{user?.hotel && (
					<p>
						<strong>Hotel ID:</strong> {user?.hotel}
					</p>
				)}
			</div>
		</div>
	);
}
