import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";

export async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// ✅ Function to detect Upwork crawler manually
function isUpworkBot(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  return /UpworkBot|Upwork/i.test(userAgent);
}

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE", // or "DRY_RUN" to test
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc.
        "STRIPE_WEBHOOK",
        "CATEGORY:MONITOR", // uptime bots
        "CATEGORY:PREVIEW", // Slack, Discord, etc.
      ],
    }),
  ],
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/webhook/stripe).*)",
  ],
};

export default createMiddleware(aj, async (request: NextRequest) => {
  // ✅ Skip Arcjet blocking for Upwork crawler
  if (isUpworkBot(request)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/webhook/stripe")) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return authMiddleware(request);
  }

  return NextResponse.next();
});
