import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: string;
}

interface UpdateUserRequest {
  name?: string;
  username?: string;
  password?: string;
  role?: string;
}

// Helper function untuk cek role admin
async function checkAdminRole(
  req: NextRequest,
): Promise<{ isAdmin: boolean; error?: NextResponse }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      isAdmin: false,
      error: NextResponse.json({ error: "Token diperlukan" }, { status: 401 }),
    };
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      username: string;
      role: string;
    };
    if (decoded.role.toLowerCase() !== "admin") {
      return {
        isAdmin: false,
        error: NextResponse.json(
          { error: "Hanya admin yang bisa akses" },
          { status: 403 },
        ),
      };
    }
    return { isAdmin: true };
  } catch {
    return {
      isAdmin: false,
      error: NextResponse.json({ error: "Token invalid" }, { status: 401 }),
    };
  }
}

export async function GET(req: NextRequest) {
  const roleCheck = await checkAdminRole(req);
  if (!roleCheck.isAdmin) return roleCheck.error!;

  try {
    const users = await prisma.users.findMany();
    const usersWithoutPassword = users.map((u) => ({
      id: u.id.toString(),
      name: u.name,
      username: u.username,
      role: u.role,
      created_at: u.created_at,
    }));
    return NextResponse.json(usersWithoutPassword);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const roleCheck = await checkAdminRole(req);
  if (!roleCheck.isAdmin) return roleCheck.error!;

  try {
    const { name, username, password, role }: CreateUserRequest =
      await req.json();

    if (!name || !username || !password || !role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: { name, username, password: hashedPassword, role },
    });

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

export async function PUT(req: NextRequest) {
  const roleCheck = await checkAdminRole(req);
  if (!roleCheck.isAdmin) return roleCheck.error!;

  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");
    const { name, username, password, role }: UpdateUserRequest =
      await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    // Perbaikan: Fix tipe updateData
    const updateData: {
      name?: string;
      username?: string;
      password?: string;
      role?: string;
    } = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (password) {
      if (password.length < 6)
        return NextResponse.json(
          { error: "Password minimal 6 karakter" },
          { status: 400 },
        );
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (role) updateData.role = role;

    if (username) {
      const existingUser = await prisma.users.findUnique({
        where: { username },
      });
      if (existingUser && Number(existingUser.id) !== id) {
        return NextResponse.json(
          { error: "Username sudah digunakan" },
          { status: 409 },
        );
      }
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role,
        created_at: updatedUser.created_at,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const roleCheck = await checkAdminRole(req);
  if (!roleCheck.isAdmin) return roleCheck.error!;

  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0");

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    await prisma.users.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "User dihapus" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "User tidak ditemukan" },
      { status: 404 },
    );
  }
}
