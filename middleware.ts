import { getJwtPayloadFromCookies } from "@/src/lib/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { AccessTokenPayload } from "./src/modules/auth/types";

const PROTECTED_ROUTES = ["/dashboard", "/setup"];
const AUTH_ROUTES = ["/sign-up", "/sign-in", "/access"];

const isProtectedPath = (pathname: string): boolean =>
	PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

const isAuthPath = (pathname: string): boolean =>
	AUTH_ROUTES.some((route) =>
		route === "/access"
			? !!pathname.match(/^\/access\/[^/]+$/)
			: pathname.startsWith(route),
	);

const redirectTo = (url: string, request: NextRequest, redirect?: string) => {
	const redirectUrl = new URL(url, request.url);
	if (redirect) {
		redirectUrl.searchParams.set("redirect", redirect);
	}
	return NextResponse.redirect(redirectUrl);
};

const getAuthenticatedDestination = (payload: AccessTokenPayload): string => {
	return payload.hid ? "/dashboard" : "/setup";
};

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	let payload: AccessTokenPayload | null;
	try {
		payload = await getJwtPayloadFromCookies<AccessTokenPayload>();
	} catch (error) {
		payload = null;
	}

	if (isProtectedPath(pathname)) {
		if (!payload) {
			return redirectTo("/sign-in", request, pathname);
		}

		if (pathname.startsWith("/dashboard") && !payload.hid) {
			return redirectTo("/setup", request, pathname);
		}

		if (pathname.startsWith("/setup") && payload.hid) {
			return redirectTo("/dashboard", request, pathname);
		}

		return NextResponse.next();
	}

	if (isAuthPath(pathname)) {
		if (payload) {
			const destination = getAuthenticatedDestination(payload);
			return redirectTo(destination, request);
		}

		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/setup/:path",
		"/access/:path*",
		"/sign-up/:path*",
		"/sign-in/:path*",
	],
};
