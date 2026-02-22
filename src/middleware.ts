import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_keep_it_safe'
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define protected routes
    const isAdminRoute = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';
    const isLoginApi = pathname === '/api/admin/login';

    // 2. Allow login page and login API without authentication
    if (isLoginPage || isLoginApi) {
        return NextResponse.next();
    }

    // 3. Protect all other /admin routes
    if (isAdminRoute) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }

        try {
            // Verify JWT
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (error) {
            const url = new URL('/admin/login', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
