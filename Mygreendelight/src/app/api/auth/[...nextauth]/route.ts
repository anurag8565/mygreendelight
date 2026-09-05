import { handlers } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    if (url.pathname.includes("/error")) {
        const error = url.searchParams.get("error") || "OAuthError";
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
    }
    try {
        return await handlers.GET(req);
    } catch (err: any) {
        console.error("NextAuth GET Handler error:", err);
        return NextResponse.redirect(new URL(`/login?error=OAuthError`, req.url));
    }
}

export async function POST(req: NextRequest) {
    try {
        return await handlers.POST(req);
    } catch (err: any) {
        console.error("NextAuth POST Handler error:", err);
        return NextResponse.redirect(new URL(`/login?error=OAuthError`, req.url));
    }
}