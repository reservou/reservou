import { AUTH_COOKIE_NAME } from "@/src/constants/auth";
import { getEnv } from "@/src/env";
import { UnauthorizedError } from "@/src/errors";
import * as jose from "jose";
import {
	JWSInvalid,
	JWSSignatureVerificationFailed,
	JWTExpired,
} from "jose/errors";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(getEnv("JWT_SECRET"));
const ALGORITHM = "HS256";

/**
 * Encrypts a payload into a JWT token.
 * @param payload The data to encode in the token
 * @returns A signed JWT string
 */
export async function encryptJwt<T extends Record<string, unknown>>(
	payload: T,
): Promise<string> {
	return new jose.SignJWT(payload)
		.setProtectedHeader({ alg: ALGORITHM })
		.setIssuedAt()
		.setExpirationTime("1day")
		.sign(JWT_SECRET);
}

/**
 * Decrypts and verifies a JWT token.
 * @param token The JWT token to verify
 * @returns The decoded payload
 * @throws UnauthorizedError if the token is invalid or expired
 */
export async function decryptJwt<T>(token: string): Promise<T> {
	try {
		const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
			algorithms: [ALGORITHM],
		});
		return payload as T;
	} catch (error) {
		if (error instanceof JWTExpired) {
			throw new UnauthorizedError("Sua sessão expirou, faça login novamente.");
		}
		if (error instanceof JWSSignatureVerificationFailed) {
			throw new UnauthorizedError("Token inválido, assinatura não verificada.");
		}
		if (error instanceof JWSInvalid || error instanceof SyntaxError) {
			throw new UnauthorizedError("Token malformado ou inválido.");
		}
		throw new UnauthorizedError("Sessão inválida, faça login novamente.");
	}
}

/**
 * Extracts and verifies the JWT token from request cookies.
 * @returns The decoded payload or null if no valid token is found
 * @throws UnauthorizedError if the token exists but is invalid
 */
export async function getJwtPayloadFromCookies<T>(): Promise<T | null> {
	const { cookies } = await import("next/headers");
	const cookieStore = await cookies();
	const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

	if (!token) {
		return null;
	}

	return decryptJwt<T>(token);
}

/**
 * Sets a JWT token in the cookies.
 * @param token The JWT token to set
 * @param options Cookie options (optional)
 * @returns Promise that resolves when the cookie is set
 */
export async function setJwtToCookies(
	token: string,
	options: Partial<{
		expires: Date | number;
		path: string;
		secure: boolean;
		httpOnly: boolean;
		sameSite: "strict" | "lax" | "none";
	}> = {},
): Promise<void> {
	const cookieStore = await cookies();

	const defaultOptions = {
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		path: "/",
		secure: getEnv("NODE_ENV") === "production",
		httpOnly: true,
		sameSite: "strict" as const,
	};

	const finalOptions = { ...defaultOptions, ...options };

	cookieStore.set(AUTH_COOKIE_NAME, token, finalOptions);
}

/**
 * Clears the JWT token from cookies, effectively logging out the user.
 * @returns Promise that resolves when the cookie is cleared
 */
export async function clearJwtFromCookies(): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.delete(AUTH_COOKIE_NAME);
}
