"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import {
	type MagicLinkOutput,
	consumeMagicLink,
} from "@/src/actions/consume-magic-link";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { useAction } from "@/src/hooks/use-action";

export default function AccessPage({
	params,
}: {
	params: React.Usable<{
		token: string;
	}>;
}) {
	const { token } = React.use(params);
	const router = useRouter();

	const { execute, isLoading, isSuccess, isError, error, data, message } =
		useAction(consumeMagicLink, {
			onSuccess: (data: MagicLinkOutput) => {
				toast.success(message, {
					description: `Olá, ${data.name}! Você foi autenticado com sucesso.`,
				});
				setTimeout(() => {
					router.push("/dashboard");
				}, 1000);
			},
			onError: (_, errorMessage) => {
				toast.error("Erro ao acessar", {
					description: errorMessage,
				});
			},
			showSuccessToast: false,
			showErrorToast: false,
		});

	React.useEffect(() => {
		execute(token);
	}, [token, execute]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Autenticação</CardTitle>
					<CardDescription>Verificando seu link de acesso</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center py-8">
					{isLoading && (
						<div className="flex flex-col items-center gap-4">
							<div className="relative">
								<div className="h-24 w-24 rounded-full border-4 border-muted-foreground/20" />
								<Loader2 className="absolute left-0 top-0 h-24 w-24 animate-spin text-primary" />
							</div>
							<p className="text-center text-muted-foreground">
								Estamos verificando seu link de acesso. Isso levará apenas
								alguns segundos...
							</p>
						</div>
					)}

					{isSuccess && (
						<div className="flex flex-col items-center gap-4">
							<div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10">
								<CheckCircle className="h-16 w-16 text-primary" />
							</div>
							<div className="text-center">
								<p className="text-xl font-medium">
									Autenticação bem-sucedida!
								</p>
								<p className="mt-1 text-muted-foreground">
									Olá, {data?.name}! Você será redirecionado para o dashboard em
									instantes.
								</p>
							</div>
						</div>
					)}

					{isError && (
						<div className="flex flex-col items-center gap-4">
							<div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-destructive/20 bg-destructive/10">
								<XCircle className="h-16 w-16 text-destructive" />
							</div>
							<div className="text-center">
								<p className="text-xl font-medium">Falha na autenticação</p>
								<p className="mt-1 text-muted-foreground">
									{
										"O link de acesso é inválido ou expirou. Por favor, solicite um novo link."
									}
								</p>
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-center">
					{isError && (
						<Button onClick={() => router.push("/login")} className="w-full">
							Voltar para o login
						</Button>
					)}
					{isSuccess && (
						<Button
							onClick={() => router.push("/dashboard")}
							className="w-full"
						>
							Ir para o dashboard
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
