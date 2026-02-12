// app/api/barang/route.ts (Semua CRUD di satu file)
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const barang = await prisma.barang.findMany();
    const barangWithNumberId = barang.map((b) => ({
      ...b,
      id: Number(b.id),
    }));
    return NextResponse.json(barangWithNumberId);
  } catch (error) {
    console.error("Error fetching barang:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nama, kode, stok, lokasi_rak } = await req.json();

    if (!nama || !kode || stok == null || stok < 0) {
      return NextResponse.json(
        { error: "Nama, kode, dan stok wajib diisi, stok harus >= 0" },
        { status: 400 },
      );
    }

    const existing = await prisma.barang.findUnique({ where: { kode } });
    if (existing) {
      return NextResponse.json(
        { error: "Kode barang sudah digunakan" },
        { status: 409 },
      );
    }

    const newBarang = await prisma.barang.create({
      data: { nama, kode, stok, lokasi_rak },
    });
    return NextResponse.json({ ...newBarang, id: Number(newBarang.id) });
  } catch (error) {
    console.error("Error creating barang:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0"); // ID dari query ?id=1
    const { nama, kode, stok, lokasi_rak } = await req.json();

    if (!id || !nama || !kode || stok == null || stok < 0) {
      return NextResponse.json(
        { error: "ID, nama, kode, dan stok wajib diisi, stok harus >= 0" },
        { status: 400 },
      );
    }

    const updatedBarang = await prisma.barang.update({
      where: { id },
      data: { nama, kode, stok, lokasi_rak },
    });
    return NextResponse.json({
      ...updatedBarang,
      id: Number(updatedBarang.id),
    });
  } catch (error) {
    console.error("Error updating barang:", error);
    return NextResponse.json(
      { error: "Barang tidak ditemukan" },
      { status: 404 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "0"); // ID dari query ?id=1

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    await prisma.barang.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Barang dihapus" });
  } catch (error) {
    console.error("Error deleting barang:", error);
    return NextResponse.json(
      { error: "Barang tidak ditemukan" },
      { status: 404 },
    );
  }
}
