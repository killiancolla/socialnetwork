// src/middleware.ts
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    console.log('Token:', token);

    if (!token) {
        console.log('No token found, redirecting to /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        await jwtVerify(token, secret);
        console.log('Token is valid');
        return NextResponse.next();
    } catch (error) {
        console.log('Invalid token, redirecting to /login');
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        '/friends/:path*',
        '/dc/:path*',
        '/account/:path*',
        '/test/:path*',
        '/'
    ],
};
