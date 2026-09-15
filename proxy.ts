import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting map.
// Note: In an Edge/Serverless environment, this state is isolated per cold-start instance,
// which makes it a "lightweight/loose" rate limit rather than an absolute strict one.
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function proxy(request: NextRequest) {
  // Only apply rate limiting to /api/assistant
  if (request.nextUrl.pathname.startsWith("/api/assistant")) {
    // Determine client IP
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 15;

    // Clean up expired entries randomly to prevent memory leaks
    if (Math.random() < 0.1) {
      for (const [key, data] of rateLimitMap.entries()) {
        if (now > data.expiresAt) {
          rateLimitMap.delete(key);
        }
      }
    }

    let record = rateLimitMap.get(ip);
    if (!record || now > record.expiresAt) {
      record = { count: 1, expiresAt: now + windowMs };
    } else {
      record.count += 1;
    }

    rateLimitMap.set(ip, record);

    if (record.count > maxRequests) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before sending more questions." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }
  }

  return NextResponse.next();
}

// Config ensures middleware skips static assets for zero performance overhead
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
