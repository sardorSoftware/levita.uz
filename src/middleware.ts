import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("admin_token")?.value;
    const isAuthenticated = token === "authenticated";
    
    const isLoginPage = pathname.startsWith("/admin/login");
    const isLoginApi = pathname.startsWith("/api/admin/login");
    
    // 1. Login API so'rovlariga har doim ruxsat berish
    if (isLoginApi) {
        return NextResponse.next();
    }
    
    // 2. Kirgan admin qayta /admin/login ga kirsa, Dashboard'ga yo'naltirish
    if (isLoginPage && isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }
    
    // 3. Login sahifasiga kirishga ruxsat
    if (isLoginPage) {
        return NextResponse.next();
    }
    
    // 4. Himoyalangan admin yo'nalishlari tekshiruvi
    if (!isAuthenticated) {
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/api/admin/:path*"
    ],
};