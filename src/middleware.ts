import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        console.log('No token found, redirecting to /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(token, secret);
        console.log('Token is valid');
        return NextResponse.next();
    } catch (error) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response;
    }
}

export const config = {
    matcher: [
        '/friends/:path*',
        '/dc/:path*',
        '/account/:path*',
        '/test/:path*',
        '/',
        '/api/users/:path*',
        '/api/comments/:path*',
        '/api/posts/:path*',
    ],
};
