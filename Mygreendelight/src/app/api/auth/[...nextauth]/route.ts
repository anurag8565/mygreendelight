import { handlers } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    if (url.pathname.includes("/api/auth/error") || url.pathname.endsWith("/error")) {
        const error = url.searchParams.get("error") || "AuthError";
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
    }
    return handlers.GET(req);
}

export const POST = handlers.POST