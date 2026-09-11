import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Login sahifasi va Login API so'rovini tekshiruvdan o'tkazib yuborish
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
        return NextResponse.next();
    }
    
    // Admin yo'nalishlarini himoya qilish
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        const token = request.cookies.get("admin_token")?.value;
        
        if (token !== "authenticated") {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Ruxsat berilmagan" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};