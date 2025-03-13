import { NextResponse } from "next/server";

import { HttpError, InternalServerError } from "@/src/errors";

type ControllerParams = Parameters<(...args: never[]) => Promise<NextResponse>>;

type Controller<T = unknown> = (
	...params: ControllerParams
) => Promise<NextResponse<T>>;

type WrappedController<T = unknown> = (
	...params: ControllerParams
) => Promise<NextResponse<T>>;

export function buildController<T = unknown>(
	controller: Controller<T>,
): WrappedController<T> {
	return async (...params: ControllerParams): Promise<NextResponse<T>> => {
		try {
			return await controller(...params);
		} catch (error) {
			if (
				error instanceof InternalServerError ||
				!(error instanceof HttpError)
			) {
				/**
				 * @todo Add logger for critical error
				 */
				console.error(error);

				return NextResponse.json(
					{
						message: "Um erro inesperado aconteceu, o suporte foi notificado.",
					},
					{ status: 500 },
				) as NextResponse<T>;
			}

			return NextResponse.json(
				{ message: error.message },
				{ status: error.statusCode, statusText: error.status },
			) as NextResponse<T>;
		}
	};
}
