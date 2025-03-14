import { randomUUID } from "node:crypto";

export interface HttpErrorOptions {
	statusCode?: number;
	status?: string;
	message?: string;
	details?: string | Record<string, unknown>;
	code?: number | string;
	correlationId?: string;
	cause?: Error;
}

export class HttpError extends Error {
	public readonly statusCode: number;
	public readonly status: string;
	public readonly details?: string | Record<string, unknown>;
	public readonly code?: number | string;
	public readonly correlationId: string;

	constructor(options: HttpErrorOptions) {
		super(options.message);
		this.statusCode = options.statusCode || 500;
		this.status = options.status || "error";
		this.details = options.details;
		this.code = options.code;
		this.correlationId = options.correlationId || randomUUID();

		if (options.cause) {
			this.stack = `${this.stack}\nCaused by: ${options.cause.stack}`;
		}

		Object.defineProperty(this, "name", {
			value: this.constructor.name,
			writable: false,
		});
	}

	toJSON() {
		return {
			status: this.status,
			statusCode: this.statusCode,
			message: this.message,
			...(this.code && { code: this.code }),
			...(this.details && { details: this.details }),
			correlationId: this.correlationId,
		};
	}
}

export class BadRequestError extends HttpError {
	constructor(message = "Bad Request", details?: HttpErrorOptions["details"]) {
		super({
			statusCode: 400,
			status: "error",
			message,
			details,
		});
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message = "Unauthorized", details?: HttpErrorOptions["details"]) {
		super({
			statusCode: 401,
			status: "error",
			message,
			details,
		});
	}
}

export class ForbiddenError extends HttpError {
	constructor(message = "Forbidden", details?: HttpErrorOptions["details"]) {
		super({
			statusCode: 403,
			status: "error",
			message,
			details,
		});
	}
}

export class NotFoundError extends HttpError {
	constructor(message = "Not Found", details?: HttpErrorOptions["details"]) {
		super({
			statusCode: 404,
			status: "error",
			message,
			details,
		});
	}
}

export class ConflictError extends HttpError {
	constructor(message = "Conflict", details?: HttpErrorOptions["details"]) {
		super({
			statusCode: 409,
			status: "error",
			message,
			details,
		});
	}
}

export class InternalServerError extends HttpError {
	constructor(
		message = "Internal Server Error",
		details?: HttpErrorOptions["details"],
		cause?: Error,
	) {
		super({
			statusCode: 500,
			status: "error",
			message,
			details,
			cause,
		});
	}
}
