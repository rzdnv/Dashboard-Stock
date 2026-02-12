// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret",
    ) as JwtPayload; // Ganti 'as any' dengan 'as JwtPayload' untuk tipe spesifik
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      decoded.role.toLowerCase() !== "admin"
    ) {
      return NextResponse.redirect(new URL("/operator/dashboard", request.url));
    }
    if (
      request.nextUrl.pathname.startsWith("/operator") &&
      decoded.role.toLowerCase() !== "operator"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/operator/:path*"],
};
