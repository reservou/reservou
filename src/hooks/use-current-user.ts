"use client";

import {
	type GetCurrentUserOutput,
	getCurrentUser,
} from "@/src/actions/get-current-user";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCurrentUser() {
	const [user, setUser] = useState<GetCurrentUserOutput | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchUser = async () => {
			setIsLoading(true);
			setIsError(false);
			setErrorMessage(null);

			try {
				const response = await getCurrentUser();
				if (isMounted) {
					setUser(response.data);
				}
			} catch (error) {
				if (isMounted) {
					setIsError(true);
					const message =
						error instanceof Error
							? error.message
							: "Erro desconhecido ao carregar usuário.";
					setErrorMessage(message);
					toast.error("Erro ao carregar dados do usuário", {
						description: message,
					});
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchUser();

		return () => {
			isMounted = false;
		};
	}, []);

	return {
		user,
		isLoading,
		isError,
		errorMessage,
	};
}
