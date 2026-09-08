import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. 🛡️ Global Rate Limiting on API requests (120 req/min per IP)
  if (pathname.startsWith("/api/")) {
    const isRegister = pathname.includes("/auth/register");
    const isOtp = pathname.includes("/send-delivery-otp");

    const limitOptions = isRegister
      ? { maxRequests: 10, windowSeconds: 60, prefix: "api_reg" }
      : isOtp
      ? { maxRequests: 5, windowSeconds: 60, prefix: "api_otp" }
      : { maxRequests: 120, windowSeconds: 60, prefix: "api_gen" };

    const rateResult = checkRateLimit(request, limitOptions);
    if (!rateResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please slow down and try again in a few seconds.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }
  }

  // 2. 🛡️ CSRF & Origin Validation for state-modifying API requests
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
          if (
            originHost !== host &&
            !originHost.includes("localhost") &&
            !originHost.includes("127.0.0.1") &&
            !originHost.includes("subziquick.in")
          ) {
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

  // 3. 🔐 Protect Admin and Delivery Boy pages
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

  // 4. 🔒 Enforce Advanced Security Headers on All Edge Responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/delivery/:path*", "/api/:path*"],
};