// src/services/transaksi.services.ts
import axios from "@/lib/axios";
import { IFormTransaksi } from "@/types/transaksi";

const transaksiServices = {
  getTransaksi: () => axios.get("/api/transaksi"),
  createTransaksi: (data: IFormTransaksi) => axios.post("/api/transaksi", data),
};

export default transaksiServices;
