"use client";

import { useState } from "react";
import { toast } from "sonner";
import { type ErrorObject, InternalServerError } from "../errors";
import type { ActionResponse } from "../lib/action";

type UseActionOptions<T> = {
	onSuccess?: (data: T) => void;
	onError?: (error: ErrorObject, message: string) => void;
	showSuccessToast?: boolean;
	showErrorToast?: boolean;
	successMessage?: string;
};

/**
 * A React hook for executing server actions wrapped by `buildAction`, providing state management and response handling.
 */
export function useAction<Params extends unknown[], Data = unknown>(
	action: (...args: Params) => Promise<ActionResponse<Data>>,
	options: UseActionOptions<Data> = {},
) {
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState<ActionResponse<Data> | null>(null);

	const execute = async (...args: Params): Promise<ActionResponse<Data>> => {
		setIsLoading(true);
		setResponse(null);

		try {
			const response = await action(...args);
			setResponse(response);

			if (response.success) {
				if (options.showSuccessToast) {
					toast.success(options.successMessage || response.message);
				}
				options.onSuccess?.(response.data);
			} else {
				if (options.showErrorToast) {
					toast.error(response.message);
				}
				options.onError?.(response.error, response.message);
			}

			return response;
		} catch (unexpectedError) {
			// This should rarely happen since the action wrapper should catch most errors
			console.error(unexpectedError);

			const errorResponse: ActionResponse<Data> = {
				data: null,
				error: {
					code: "UNEXPECTED_ERROR",
					correlationId: new InternalServerError().correlationId,
					details: "An unexpected error occurred",
					message: "Um erro inesperado ocorreu",
					status: "error",
					statusCode: 500,
				},
				message: "Um erro inesperado ocorreu, o suporte foi notificado.",
				success: false,
			};

			setResponse(errorResponse);

			if (options.showErrorToast) {
				toast.error(errorResponse.message);
			}
			options.onError?.(errorResponse.error, errorResponse.message);

			return errorResponse;
		} finally {
			setIsLoading(false);
		}
	};

	const reset = () => {
		setResponse(null);
	};

	return {
		execute,
		isLoading,
		error: response?.success === false ? response.error : null,
		data: response?.success === true ? response.data : null,
		message: response?.message ?? "",
		reset,
		isError: response?.success === false,
		isSuccess: response?.success === true,
	};
}
