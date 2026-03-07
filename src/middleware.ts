import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only apply basic auth to /kitchen routes
  if (req.nextUrl.pathname.startsWith('/kitchen')) {
    const basicAuth = req.headers.get('authorization');

    // We require these environment variables to be set for the kitchen dashboard to be accessible.
    const validUser = process.env.KITCHEN_USER;
    const validPassword = process.env.KITCHEN_PASSWORD;

    // Failsafe: if credentials are not configured, deny access immediately to prevent bypass.
    if (!validUser || !validPassword) {
      return new NextResponse('Server configuration error: Kitchen access credentials are not set.', { status: 500 });
    }

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === validUser && pwd === validPassword) {
        return NextResponse.next();
      }
    }

    // Return 401 with WWW-Authenticate header to trigger browser login prompt
    return new NextResponse('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Kitchen Dashboard Secure Access"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/kitchen/:path*'],
};
