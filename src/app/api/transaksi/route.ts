// app/api/transaksi/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET() {
  try {
    const transaksi = await prisma.transaksi.findMany({
      include: { barang: true, users: true },
    });
    const transaksiWithNumberId = transaksi.map((t) => ({
      ...t,
      id: Number(t.id),
      barang_id: Number(t.barang_id),
      user_id: Number(t.user_id),
      barang: { ...t.barang, id: Number(t.barang.id) },
      users: { ...t.users, id: Number(t.users.id), password: undefined },
    }));
    return NextResponse.json(transaksiWithNumberId);
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tipe_transaksi, jumlah, barang_id } = await req.json();

    // Validasi input – Perbaikan: Gunakan uppercase untuk enum
    if (
      !tipe_transaksi ||
      !jumlah ||
      !barang_id ||
      jumlah <= 0 ||
      !["MASUK", "KELUAR"].includes(tipe_transaksi) // Ganti ke uppercase
    ) {
      return NextResponse.json(
        {
          error:
            "Tipe transaksi (MASUK/KELUAR), jumlah >0, dan barang_id wajib",
        },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token diperlukan" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user_id = decoded.id; // Pastikan number

    const result = await prisma.$transaction(async (tx) => {
      const barang = await tx.barang.findUnique({ where: { id: barang_id } });
      if (!barang) throw new Error("Barang tidak ditemukan");

      const newStock =
        tipe_transaksi === "MASUK"
          ? barang.stok + jumlah
          : barang.stok - jumlah; // Ganti ke uppercase

      if (newStock < 0)
        throw new Error("Stok tidak cukup untuk transaksi keluar");

      await tx.barang.update({
        where: { id: barang_id },
        data: { stok: newStock },
      });

      const transaksi = await tx.transaksi.create({
        data: {
          tipe_transaksi, // Sekarang uppercase
          jumlah,
          barang_id,
          user_id,
          tanggal: new Date(),
        },
      });

      return transaksi;
    });

    return NextResponse.json({
      ...result,
      id: Number(result.id),
      barang_id: Number(result.barang_id),
      user_id: Number(result.user_id),
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan server";
    console.error("Error creating transaksi:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
