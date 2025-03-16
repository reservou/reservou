import { getJwtPayloadFromCookies } from "@/src/lib/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { AccessTokenPayload } from "./src/types";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const protectedRoute = "/dashboard";
	const isProtectedRoute = pathname.startsWith(protectedRoute);

	const authRoutes = ["/sign-up", "/access"];
	const isAuthRoute = authRoutes.some((route) =>
		route === "/access"
			? pathname.match(/^\/access\/[^/]+$/)
			: pathname.startsWith(route),
	);

	let payload: AccessTokenPayload | null;
	try {
		payload = await getJwtPayloadFromCookies<AccessTokenPayload>();
	} catch (error) {
		payload = null;
	}

	if (isProtectedRoute) {
		if (!payload) {
			/**
			 * @todo Replace "/sign-up" redirect URL once sign-up page is implemented
			 */
			const signInUrl = new URL("/sign-up", request.url);
			signInUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(signInUrl);
		}
		return NextResponse.next();
	}

	if (isAuthRoute) {
		if (payload) {
			const dashboardUrl = new URL("/dashboard", request.url);
			return NextResponse.redirect(dashboardUrl);
		}
		return NextResponse.next();
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/access/:path*", "/sign-up/:path*"],
};
