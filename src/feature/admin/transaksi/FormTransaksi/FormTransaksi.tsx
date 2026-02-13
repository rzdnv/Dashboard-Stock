// src/feature/admin/transaksi/form.tsx (atau sesuai path Anda)
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import transaksiServices from "@/services/transaksi.services";
import barangServices from "@/services/barang.services";
import { toast } from "sonner";
import { IBarang } from "@/types/barang";
import { IFormTransaksi } from "@/types/transaksi";

const schema = yup.object({
  tipe_transaksi: yup
    .string()
    .oneOf(["MASUK", "KELUAR"])
    .required("Tipe transaksi wajib"),
  jumlah: yup.number().positive("Jumlah harus >0").required("Jumlah wajib"),
  barang_id: yup.number().required("Barang wajib dipilih"),
});

const FormTransaksi = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IFormTransaksi>({
    resolver: yupResolver(schema),
  });

  // list barang
  const { data: barangList } = useQuery({
    queryKey: ["barang"],
    queryFn: async () => {
      const { data } = await barangServices.getBarang();
      return data;
    },
  });

  // Mutation untuk create transaksi
  const createTransaksiMutation = useMutation({
    mutationFn: transaksiServices.createTransaksi,
    onSuccess: () => {
      toast.success("Transaksi berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["transaksi"] });
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
    onError: () => {
      toast.error("Transaksi gagal");
    },
  });

  const onSubmit = (data: IFormTransaksi) => {
    createTransaksiMutation.mutate(data);
  };

  const selectedBarangId = watch("barang_id");
  const selectedBarang = barangList?.find(
    (b: IBarang) => b.id === selectedBarangId,
  );
  const tipeTransaksi = watch("tipe_transaksi");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Transaksi</CardTitle>
        <CardDescription>Masukkan data transaksi barang.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipe_transaksi">Tipe Transaksi</Label>
            <Select
              onValueChange={(value) =>
                setValue("tipe_transaksi", value as "MASUK" | "KELUAR")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MASUK">Masuk</SelectItem>
                <SelectItem value="KELUAR">Keluar</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipe_transaksi && (
              <p className="text-red-500 text-sm">
                {errors.tipe_transaksi.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="barang_id">Barang</Label>
            <Select
              onValueChange={(value) => setValue("barang_id", Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih barang" />
              </SelectTrigger>
              <SelectContent>
                {barangList?.map((barang: IBarang) => (
                  <SelectItem key={barang.id} value={barang.id.toString()}>
                    {barang.nama} (Stok: {barang.stok})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.barang_id && (
              <p className="text-red-500 text-sm">{errors.barang_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jumlah">Jumlah</Label>
            <Input
              id="jumlah"
              type="number"
              {...register("jumlah")}
              placeholder="Masukkan jumlah"
            />
            {errors.jumlah && (
              <p className="text-red-500 text-sm">{errors.jumlah.message}</p>
            )}
            {selectedBarang && tipeTransaksi === "KELUAR" && (
              <p className="text-sm text-gray-600">
                Maksimal keluar: {selectedBarang.stok}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createTransaksiMutation.isPending}
          >
            {createTransaksiMutation.isPending ? "Proses..." : "Buat Transaksi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormTransaksi;
