import { handlers } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    // Intercept any NextAuth error page request to prevent internal 500 render crash
    if (url.pathname.endsWith("/error")) {
        const error = url.searchParams.get("error") || "OAuthError";
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
    }
    return handlers.GET(req);
}

export async function POST(req: NextRequest) {
    return handlers.POST(req);
}