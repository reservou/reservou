import { type ErrorObject, HttpError, InternalServerError } from "@/src/errors";

export type ActionResponse<T = null> =
	| {
			data: T;
			error: null;
			message: string;
			success: true;
	  }
	| {
			data: null;
			error: ErrorObject;
			message: string;
			success: false;
	  };

type Action<Params extends unknown[], Data = unknown> = (
	...args: Params
) => Promise<ActionResponse<Data>>;

/**
 * Wraps server actions with consistent error handling and response structure
 */
export function buildAction<Params extends unknown[], Data>(
	action: (...args: Params) => Promise<Data>,
): Action<Params, Data> {
	return async (...args: Params): Promise<ActionResponse<Data>> => {
		try {
			const result = await action(...args);

			return {
				data: result,
				error: null,
				message: "Success",
				success: true,
			};
		} catch (caughtError) {
			const userSafeError =
				caughtError instanceof HttpError &&
				!(caughtError instanceof InternalServerError);
			const supportCriticalError = caughtError instanceof InternalServerError;
			const unknownCriticalError = !(caughtError instanceof HttpError);

			if (userSafeError) {
				const httpError = caughtError as HttpError;
				return {
					data: null,
					error: {
						code: httpError.code,
						correlationId: httpError.correlationId,
						details: httpError.details ?? httpError.message,
						message: httpError.message,
						status: httpError.status,
						statusCode: httpError.statusCode,
					},
					message: httpError.message,
					success: false,
				};
			}

			if (supportCriticalError) {
				const internalError = caughtError as InternalServerError;
				console.error(internalError);

				return {
					data: null,
					error: {
						code: internalError.code,
						correlationId: internalError.correlationId,
						details: internalError.details ?? internalError.message,
						message: internalError.message,
						status: internalError.status,
						statusCode: internalError.statusCode,
					},
					message: "Um erro inesperado aconteceu, o suporte foi notificado.",
					success: false,
				};
			}

			if (unknownCriticalError) {
				console.error(caughtError);

				return {
					data: null,
					error: {
						code: "UNKNOWN_ERROR",
						correlationId: new InternalServerError().correlationId,
						details: "An unexpected error occurred",
						message: "Um erro inesperado aconteceu",
						status: "error",
						statusCode: 500,
					},
					message: "Um erro inesperado aconteceu, o suporte foi notificado.",
					success: false,
				};
			}

			// This should never happen due to the above conditions
			return {
				data: null,
				error: {
					code: "UNKNOWN_ERROR",
					correlationId: new InternalServerError().correlationId,
					details: "An unknown error occurred",
					message: "Erro desconhecido",
					status: "error",
					statusCode: 500,
				},
				message: "Erro desconhecido.",
				success: false,
			};
		}
	};
}
