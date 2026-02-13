// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Setup adapter dan koneksi database (sesuai setup Anda)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Singleton PrismaClient dengan adapter
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface JwtPayload {
  id: string; // PERBAIKAN: id sebagai string karena dari JWT adalah string
  username: string;
  role: string;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  console.log("Token received:", token); // Debug log untuk cek token

  try {
    // Pastikan JWT_SECRET di .env.local sama dengan yang digunakan di login API
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set in environment");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }
    console.log("JWT_SECRET used:", secret); // Debug log untuk cek secret

    // Decode token dengan interface JwtPayload
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log("Decoded token:", decoded); // Debug log untuk cek decoded

    // Fetch user dari DB berdasarkan id – PERBAIKAN: Gunakan BigInt untuk id jika schema Prisma id adalah BigInt
    const user = await prisma.users.findUnique({
      where: { id: BigInt(decoded.id) }, // Gunakan BigInt untuk match schema Prisma
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // PERBAIKAN: Konversi id kembali ke string untuk response JSON (karena BigInt tidak bisa serialize langsung)
    const userResponse = {
      ...user,
      id: user.id.toString(), // Konversi BigInt ke string
    };

    return NextResponse.json(userResponse);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error verifying token:", errorMessage); // Debug log untuk error spesifik
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: "Invalid token signature" },
        { status: 401 },
      );
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
