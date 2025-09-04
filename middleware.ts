import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const csp = `
    script-src 'self' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com;
    connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://graph.facebook.com https://region1.google-analytics.com;
  `;

  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    csp.replace(/\n/g, " ").trim()
  );
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)?",
  ],
};
