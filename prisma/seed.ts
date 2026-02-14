// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Password "password123" sudah di-hash dengan bcrypt (salt rounds 10)
  // Hash ini di-generate dari bcrypt online tool atau script
  const hashedPassword = "$2b$10$abcdefghijklmnopqrstuvwx.yz1234567890"; // Placeholder – ganti dengan hash asli

  // Buat akun admin
  await prisma.users.create({
    data: {
      name: "Super Admin",
      username: "SuperAdmin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Buat akun operator
  await prisma.users.create({
    data: {
      name: "Operator User",
      username: "Operator",
      password: hashedPassword, // Sama atau hash baru jika mau beda password
      role: "OPERATOR",
    },
  });

  console.log("Users created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
