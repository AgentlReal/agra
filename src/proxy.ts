import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/curriculum') ||
    pathname.startsWith('/recall') ||
    pathname.startsWith('/learning') ||
    pathname.startsWith('/simulations') ||
    pathname.startsWith('/submaterials') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/admin');

  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const middleware = proxy;
export default proxy;

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/curriculum',
    '/curriculum/:path*',
    '/recall',
    '/recall/:path*',
    '/learning',
    '/learning/:path*',
    '/simulations',
    '/simulations/:path*',
    '/submaterials',
    '/submaterials/:path*',
    '/onboarding',
    '/onboarding/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
