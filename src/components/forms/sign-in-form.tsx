"use client";

import { signInWithGoogle } from "@/src/actions/sign-in-with-google";
import { signInWithMagicLink } from "@/src/actions/sign-in-with-magic-link";
import { Button } from "@/src/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import { useAction } from "@/src/hooks/use-action";
import {
	auth as firebaseAuth,
	googleProvider,
	signInWithPopup,
} from "@/src/lib/firebase/client";
import { type SignInInput, signInSchema } from "@/src/schemas/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Loader2, MailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SiGoogle } from "react-icons/si";
import { toast } from "sonner";

export function SignInForm() {
	const router = useRouter();
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

	const form = useForm<SignInInput>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
		},
	});

	const {
		execute: proceedWithMagicLink,
		isLoading: isMagicLinkLoading,
		isSuccess: isMagicLinkSuccess,
	} = useAction(signInWithMagicLink, {
		onSuccess: () => {
			toast.success("Enviamos um link de acesso, verifique seu e-mail.");
		},
		onError: (_, errorMessage) => {
			toast.error(errorMessage);
		},
		showSuccessToast: false,
		showErrorToast: false,
	});

	const { execute: proceedWithGoogle, isLoading: isGoogleActionLoading } =
		useAction(signInWithGoogle, {
			onSuccess: (data) => {
				toast.success("Bem-vindo!", {
					description: `Olá, ${data.name}! Você foi autenticado com sucesso.`,
				});
				setTimeout(() => {
					router.push("/dashboard");
				}, 1000);
			},
			onError: (_, errorMessage) => {
				toast.error("Erro ao autenticar com Google", {
					description: errorMessage,
				});
			},
			showSuccessToast: false,
			showErrorToast: false,
		});

	async function onMagicLinkSubmit(data: SignInInput) {
		await proceedWithMagicLink(data);
	}

	const handleGoogleSignIn = async () => {
		setIsGoogleLoading(true);
		try {
			const result = await signInWithPopup(firebaseAuth, googleProvider);
			const idToken = await result.user.getIdToken();

			await proceedWithGoogle(idToken);
		} catch (error) {
			console.error("Google sign-in error:", error);
			toast.error("Erro ao tentar login com Google", {
				description:
					error instanceof Error ? error.message : "Erro desconhecido",
			});
		} finally {
			setIsGoogleLoading(false);
		}
	};

	return (
		<div className="w-full space-y-6">
			<div className="flex justify-center">
				<Image
					src="/logo.svg?height=56&width=56"
					alt="Logo"
					width={56}
					height={56}
				/>
			</div>

			<div className="space-y-2 text-center">
				<h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
				<p className="text-sm text-muted-foreground">
					Faça login para acessar sua conta
				</p>
			</div>

			<div className="space-y-4">
				<Button
					variant="outline"
					type="button"
					disabled={isGoogleLoading || isGoogleActionLoading}
					onClick={handleGoogleSignIn}
					className="w-full"
				>
					{isGoogleLoading || isGoogleActionLoading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<SiGoogle className="mr-2 h-4 w-4" />
					)}
					Entrar com Google
				</Button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<Separator />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Ou entre com
						</span>
					</div>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onMagicLinkSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input placeholder="nome@exemplo.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={isMagicLinkLoading || isMagicLinkSuccess}
						>
							{isMagicLinkLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : isMagicLinkSuccess ? (
								<CheckIcon className="mr-2 h-4 w-4" />
							) : (
								<MailIcon className="mr-2 h-4 w-4" />
							)}
							{isMagicLinkSuccess
								? "Link de acesso enviado"
								: "Entrar com Magic Link"}
						</Button>
					</form>
				</Form>
			</div>

			<div className="text-center text-sm">
				Não possui uma conta?{" "}
				<Link
					href="/sign-up"
					className="underline underline-offset-4 hover:text-primary"
				>
					Cadastre-se
				</Link>
			</div>
		</div>
	);
}
