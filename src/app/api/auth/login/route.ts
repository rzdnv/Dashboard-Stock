// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@/generated/prisma";
// import bcrypt from "bcrypt";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   try {
//     const { username, password } = await req.json();

//     // Cari user berdasarkan username
//     const user = await prisma.users.findUnique({
//       where: { username },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Username tidak ditemukan" },
//         { status: 401 },
//       );
//     }

//     // Verifikasi password (asumsikan password di-hash dengan bcrypt)
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json({ error: "Password salah" }, { status: 401 });
//     }

//     // Jika berhasil, return data user (atau token jika pakai JWT)
//     return NextResponse.json({
//       success: true,
//       user: { id: user.id, name: user.name, role: user.role },
//     });
//   } catch (error) {
//     console.error("Error login:", error);
//     return NextResponse.json(
//       { error: "Terjadi kesalahan server" },
//       { status: 500 },
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILogin } from "@/types/auth";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Get IP from headers (Next.js way)
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown"; // Ambil IP pertama jika forwarded

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan login, coba lagi nanti" },
        { status: 429 },
      );
    }

    const { username, password }: ILogin = await req.json();

    // Cari user
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { error: "Username tidak ditemukan" },
        { status: 401 },
      );
    }

    // Verifikasi password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Response dengan token
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
      token,
    });

    // Set secure cookie untuk token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error login:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
