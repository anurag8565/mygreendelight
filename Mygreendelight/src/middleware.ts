import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. 🛡️ CSRF & Origin Validation for state-modifying API requests
  if (pathname.startsWith("/api/") && ["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    // Exempt Paytm and payment webhooks which come from external gateways
    const isWebhook = pathname.includes("/payment/verify") || pathname.includes("/wallet/verify");
    if (!isWebhook) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");

      if (origin && host) {
        try {
          const originHost = new URL(origin).host;
          // Allow requests from same host or localhost during dev
          if (originHost !== host && !originHost.includes("localhost") && !originHost.includes("127.0.0.1") && !originHost.includes("subziquick.in")) {
            return NextResponse.json(
              { success: false, message: "Cross-site request blocked by security policy" },
              { status: 403 }
            );
          }
        } catch (_) {
          // Invalid origin format
        }
      }
    }
  }

  // 2. 🔐 Protect Admin and Delivery Boy pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/delivery")) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // 3. 🔒 Enforce Security Headers on All Edge Responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/delivery/:path*", "/api/:path*"],
};