// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Allow /admin and all its subroutes to continue
  if (url.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow the coming-soon page itself
  if (url.pathname === '/coming-soon') {
    return NextResponse.next();
  }

  // Redirect everything else to /coming-soon
  return NextResponse.redirect(new URL('/coming-soon', request.url));
}

// Apply middleware to all routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
