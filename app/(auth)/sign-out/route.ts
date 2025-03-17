import { getEnv } from "@/src/env";
import { clearJwtFromCookies } from "@/src/lib/jwt";
import { NextResponse } from "next/server";

/**
 * @todo Kill the session when is stored in database
 * @returns
 */
export async function GET() {
	await clearJwtFromCookies();
	return NextResponse.redirect(`${getEnv("NEXT_PUBLIC_APP_URL")}/sign-in`);
}
