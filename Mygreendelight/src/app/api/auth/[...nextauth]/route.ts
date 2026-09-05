import { handlers } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    // Intercept any NextAuth error page request to prevent internal 500 render crash
    if (url.pathname.endsWith("/error")) {
        const error = url.searchParams.get("error") || "OAuthError";
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
    }

    try {
        const res = await handlers.GET(req);
        
        // If session route returns 500 (e.g. from mismatched secret/corrupted cookie decrypt error),
        // return 200 with empty session object and delete the corrupted session cookies.
        if (url.pathname.endsWith("/session") && res.status >= 500) {
            const cleanRes = NextResponse.json({}, { status: 200 });
            cleanRes.cookies.delete("authjs.session-token");
            cleanRes.cookies.delete("__Secure-authjs.session-token");
            cleanRes.cookies.delete("next-auth.session-token");
            cleanRes.cookies.delete("__Secure-next-auth.session-token");
            return cleanRes;
        }

        return res;
    } catch (err) {
        console.error("NextAuth GET route error:", err);
        if (url.pathname.endsWith("/session")) {
            const cleanRes = NextResponse.json({}, { status: 200 });
            cleanRes.cookies.delete("authjs.session-token");
            cleanRes.cookies.delete("__Secure-authjs.session-token");
            cleanRes.cookies.delete("next-auth.session-token");
            cleanRes.cookies.delete("__Secure-next-auth.session-token");
            return cleanRes;
        }
        return NextResponse.redirect(new URL(`/login?error=AuthError`, req.url));
    }
}

export async function POST(req: NextRequest) {
    try {
        return await handlers.POST(req);
    } catch (err) {
        console.error("NextAuth POST route error:", err);
        return NextResponse.redirect(new URL(`/login?error=AuthError`, req.url));
    }
}