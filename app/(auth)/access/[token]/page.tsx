"use client";

import { consumeMagicLink } from "@/src/modules/auth/actions/consume-magic-link";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AccessTokenPage({
	params,
}: { params: React.Usable<{ token: string }> }) {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const { token } = React.use(params);

	useEffect(() => {
		const handleMagicLink = async () => {
			try {
				const response = await consumeMagicLink(token);

				if (response.success && response.data) {
					router.push("/dashboard");
				} else if (!response.success && response.error) {
					setErrorMessage(response.message);
				}
			} catch (error) {
				setErrorMessage(
					"Ocorreu um erro inesperado ao processar o magic link.",
				);
			} finally {
				setIsLoading(false);
			}
		};

		handleMagicLink();
	}, [token, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Processando seu magic link...</p>
			</div>
		);
	}

	if (errorMessage) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center p-6 max-w-md">
					<h1 className="text-2xl font-bold mb-4">Falha na Autenticação</h1>
					<p className="text-red-600 mb-4">{errorMessage}</p>
					<Link href="/sign-in" className="text-blue-600 hover:underline">
						Voltar para o Login
					</Link>
				</div>
			</div>
		);
	}

	return null;
}
