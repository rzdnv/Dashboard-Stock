"use client";

import { IBarang } from "@/types/barang";
import { ITransaksi } from "@/types/transaksi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Dashboard = () => {
  // Fetch data barang dengan tipe eksplisit
  const {
    data: barang,
    isLoading: loadingBarang,
    error: errorBarang,
  } = useQuery<IBarang[]>({
    queryKey: ["barang"],
    queryFn: () => axios.get("/api/barang").then((res) => res.data),
  });

  // Fetch data transaksi dengan tipe eksplisit
  const { data: transaksi, isLoading: loadingTransaksi } = useQuery<
    ITransaksi[]
  >({
    queryKey: ["transaksi"],
    queryFn: () => axios.get("/api/transaksi").then((res) => res.data),
  });

  if (loadingBarang || loadingTransaksi) return <p>Loading...</p>;
  if (errorBarang) return <p>Error loading data: {errorBarang.message}</p>;

  // Hitung summary
  const totalBarang = barang?.length || 0;
  const totalTransaksiMasuk =
    transaksi?.filter((t) => t.tipe_transaksi === "MASUK").length || 0;
  const totalTransaksiKeluar =
    transaksi?.filter((t) => t.tipe_transaksi === "KELUAR").length || 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-4 mb-8">
        <div className="p-4 bg-blue-100 border rounded">
          <h3 className="text-lg font-semibold">Total Barang</h3>
          <p className="text-2xl">{totalBarang}</p>
        </div>
        <div className="p-4 bg-green-100 border rounded">
          <h3 className="text-lg font-semibold">Transaksi Masuk</h3>
          <p className="text-2xl">{totalTransaksiMasuk}</p>
        </div>
        <div className="p-4 bg-red-100 border rounded">
          <h3 className="text-lg font-semibold">Transaksi Keluar</h3>
          <p className="text-2xl">{totalTransaksiKeluar}</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
