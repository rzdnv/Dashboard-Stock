import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const authToken = req.cookies.get("auth-token")?.value; // Tambah cek cookie auth-token

    // Jika akses /login dan sudah punya session atau auth-token, redirect ke dashboard sesuai role
    if (req.nextUrl.pathname === "/login" && (token || authToken)) {
      let role = token?.role;
      if (!role && authToken) {
        try {
          const decoded = jwt.verify(authToken, JWT_SECRET) as { role: string };
          role = decoded.role;
        } catch {
          // Invalid token, tetap di login
        }
      }
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else if (role === "OPERATOR") {
        return NextResponse.redirect(new URL("/operator/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url)); // Default
      }
    }

    // Logic role untuk protected routes
    if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/operator/dashboard", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/operator") &&
      token?.role !== "OPERATOR"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // Jika tidak ada auth-token, redirect ke login untuk semua halaman kecuali login, API, static
    if (
      !authToken &&
      !req.nextUrl.pathname.startsWith("/login") &&
      !req.nextUrl.pathname.startsWith("/api") &&
      !req.nextUrl.pathname.includes("_next")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"], // Protect semua kecuali /login, API, static files
};
