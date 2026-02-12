import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Response untuk clear cookies
  const response = NextResponse.json({ success: true });

  // Hapus cookie auth-token
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
}
