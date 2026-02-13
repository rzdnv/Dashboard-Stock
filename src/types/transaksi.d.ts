export interface ITransaksi {
  id: number;
  barang_id: number;
  user_id: number;
  jumlah: number;
  tipe_transaksi: "MASUK" | "KELUAR";
  tanggal: string;
  barang?: { nama: string };
  users?: { name: string };
}

export interface IFormTransaksi {
  tipe_transaksi: "MASUK" | "KELUAR";
  jumlah: number;
  barang_id: number;
}
