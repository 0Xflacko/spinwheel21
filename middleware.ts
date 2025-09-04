import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://www.facebook.com https://www.google-analytics.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://graph.facebook.com;
    frame-src https://www.googletagmanager.com https://www.facebook.com;
  `;

  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', csp.replace(/\n/g, ' ').trim());
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)?',
  ],
};
