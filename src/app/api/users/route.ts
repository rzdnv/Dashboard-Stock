// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Tambah import JWT

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Tambah secret

interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: string;
}

export async function POST(req: NextRequest) {
  try {
    // Auth: Decode JWT token dan cek role admin – PERBAIKAN UTAMA
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token diperlukan" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      role: string;
    };
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Hanya admin yang bisa menambah user" },
        { status: 403 },
      );
    }

    const { name, username, password, role }: CreateUserRequest =
      await req.json();

    // Validasi input dasar
    if (!name || !username || !password || !role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cek username unik
    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = await prisma.users.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role,
      },
    });

    // Response tanpa password – konversi id ke string
    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id.toString(),
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
