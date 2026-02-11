// app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // Cek autentikasi sederhana (ganti dengan logic Anda)
  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("user");

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="text-center mt-10">
      <h1>Selamat Datang di Dashboard Stok</h1>
      <p>Navigasi ke dashboard untuk kelola data.</p>
    </div>
  );
}
