import { BadRequestError, InternalServerError } from "@/src/lib/errors";
import { ZodError, type ZodSchema, type z } from "zod";

/**
 * Validates the Zod schema and throws a {@link BadRequestError} if validation fails,
 * or an {@link InternalServerError} for unexpected errors.
 */
export async function validator<T extends ZodSchema>(
	schema: T,
	data: unknown,
): Promise<z.infer<T>> {
	try {
		const result = await schema.parseAsync(data);
		return result;
	} catch (error) {
		if (error instanceof ZodError) {
			const errorMessages = error.errors.map((err) => {
				const path =
					err.path.length > 0 ? `Field '${err.path.join(".")}'` : "Input";
				return `${path}: ${err.message}`;
			});

			throw new BadRequestError("Validation failed", {
				details: errorMessages.join(", "),
				cause: error,
			});
		}
		throw new InternalServerError(
			"An unexpected validation error occurred",
			undefined,
			error as Error,
		);
	}
}

/**
 * Creates a validator function for the given schema that throws HttpError-based exceptions.
 * @returns A {@link validator} function that validates data against the schema
 */
export function buildValidator<T extends ZodSchema>(
	schema: T,
): (data: unknown) => Promise<z.infer<T>> {
	return (data: unknown) => validator(schema, data);
}
