"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Shadcn/ui
import { Button } from "@/components/ui/button";

export default function BarangPage() {
  const {
    data: barang,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["barang"],
    queryFn: async () => {
      const res = await axios.get("/api/barang");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error: {error.message}</p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Barang</h1>
      <Button onClick={() => refetch()} className="mb-4">
        Refresh
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Stok</TableHead>
            <TableHead>Lokasi Rak</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {barang?.map((b: any) => (
            <TableRow key={b.id}>
              <TableCell>{b.nama}</TableCell>
              <TableCell>{b.kode}</TableCell>
              <TableCell>{b.stok}</TableCell>
              <TableCell>{b.lokasi_rak}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
