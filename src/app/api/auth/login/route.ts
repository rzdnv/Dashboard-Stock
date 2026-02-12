import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ILogin } from "@/types/auth";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const { username, password }: ILogin = await req.json();

    // Validasi input dasar
    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return NextResponse.json(
        {
          error:
            "Username dan password wajib diisi, password minimal 6 karakter",
        },
        { status: 400 },
      );
    }

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

    const token = jwt.sign(
      { id: user.id.toString(), username: user.username, role: user.role }, // user.id.toString() mencegah error serialisasi
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Response dengan token – id sudah dikonversi
    const response = NextResponse.json({
      success: true,
      user: { id: user.id.toString(), name: user.name, role: user.role },
      token,
    });

    // Set secure cookie untuk token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 jam
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
