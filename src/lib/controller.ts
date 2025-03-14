import { type ErrorObject, HttpError, InternalServerError } from "@/src/errors";
import { NextResponse } from "next/server";

type BaseResponse<Data = unknown> = {
	data: Data | null;
	error: ErrorObject | null;
	message: string;
};

type ControllerParams = Parameters<(...args: never[]) => Promise<NextResponse>>;

type Controller<Body extends BaseResponse> = (
	...params: ControllerParams
) => Promise<NextResponse<Body>>;

/**
 * Enforces a uniform { data, error, message } response structure for API consistency,
 * while concealing sensitive error details from clients for security.
 */
function buildController<Data = unknown>(
	controller: Controller<BaseResponse<Data>>,
) {
	return async (
		...params: ControllerParams
	): Promise<NextResponse<BaseResponse<Data>>> => {
		try {
			return await controller(...params);
		} catch (caughtError) {
			const userSafeError =
				caughtError instanceof HttpError &&
				!(caughtError instanceof InternalServerError);
			const supportCriticalError = caughtError instanceof InternalServerError;
			const unknownCriticalError = !(caughtError instanceof HttpError);

			if (userSafeError) {
				const httpError = caughtError as HttpError;
				return NextResponse.json(
					{
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
					},
					{
						status: httpError.statusCode,
						statusText: httpError.status,
					},
				);
			}

			/**
			 * @todo Replace console.error when logger is implement to log critical errors
			 */
			if (supportCriticalError) {
				const internalError = caughtError as InternalServerError;
				console.error(internalError);
				return NextResponse.json(
					{
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
					},
					{ status: 500 },
				);
			}

			if (unknownCriticalError) {
				console.error(caughtError);
				return NextResponse.json(
					{
						data: null,
						error: null,
						message: "Um erro inesperado aconteceu, o suporte foi notificado.",
					},
					{ status: 500 },
				);
			}

			return NextResponse.json(
				{
					data: null,
					error: null,
					message: "Erro desconhecido.",
				},
				{ status: 500 },
			);
		}
	};
}

export { buildController };
export type { BaseResponse };
