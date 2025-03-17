"use client";

import { signUpWithGoogle } from "@/src/actions/sign-up-with-google";
import { signUpWithMagicLink } from "@/src/actions/sign-up-with-magic-link";
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
import { type SignUpInput, signUpSchema } from "@/src/schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, MailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SiGoogle } from "react-icons/si";
import { toast } from "sonner";
import { Loading } from "../animations/loading";

export function SignUpForm() {
	const router = useRouter();
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

	const form = useForm<SignUpInput>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			name: "",
		},
	});

	const {
		execute: proceedWithMagicLink,
		isLoading: isMagicLinkLoading,
		isSuccess: isMagicLinkSuccess,
	} = useAction(signUpWithMagicLink, {
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
		useAction(signUpWithGoogle, {
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

	async function onMagicLinkSubmit(data: SignUpInput) {
		await proceedWithMagicLink(data);
	}

	const handleGoogleSignIn = async () => {
		const name = form.getValues("name");

		if (!name || name.trim() === "") {
			form.setError("name", {
				type: "manual",
				message: "Por favor, informe seu nome antes de prosseguir com Google.",
			});
			return;
		}

		form.clearErrors();

		setIsGoogleLoading(true);
		try {
			const result = await signInWithPopup(firebaseAuth, googleProvider);
			const idToken = await result.user.getIdToken();

			await proceedWithGoogle({ idToken, name });
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
				<h1 className="text-2xl font-semibold tracking-tight">
					Criar uma conta
				</h1>
				<p className="text-sm text-muted-foreground">
					Cadastre-se para começar a usar nossa plataforma
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
						<Loading />
					) : (
						<SiGoogle className="mr-2 h-4 w-4" />
					)}
					Cadastrar com Google
				</Button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<Separator />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Ou continue com
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input placeholder="Digite seu nome" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
								<Loading />
							) : isMagicLinkSuccess ? (
								<CheckIcon className="mr-2 h-4 w-4" />
							) : (
								<MailIcon className="mr-2 h-4 w-4" />
							)}
							{isMagicLinkSuccess
								? "Link de acesso enviado"
								: "Cadastrar com Magic Link"}
						</Button>
					</form>
				</Form>
			</div>

			<div className="text-center text-sm">
				Ao se cadastrar, você concorda com nossos{" "}
				<Link
					href="/terms"
					className="underline underline-offset-4 hover:text-primary"
				>
					Termos de Serviço
				</Link>{" "}
				e{" "}
				<Link
					href="/privacy"
					className="underline underline-offset-4 hover:text-primary"
				>
					Política de Privacidade
				</Link>
				.
			</div>

			<div className="text-center text-sm">
				Já possui uma conta?{" "}
				<Link
					href="/sign-in"
					className="underline underline-offset-4 hover:text-primary"
				>
					Entrar
				</Link>
			</div>
		</div>
	);
}
