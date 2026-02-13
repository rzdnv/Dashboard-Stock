"use client";

import transaksiServices from "@/services/transaksi.services";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { ITransaksi } from "@/types/transaksi";

const TabelTransaksi = () => {
  const getListTransaksi = async () => {
    const { data } = await transaksiServices.getTransaksi();
    return data;
  };
  const {
    data: transaksi,
    isLoading,
    // error,
  } = useQuery({
    queryKey: ["transaksi"],
    queryFn: () => getListTransaksi(),
  });

  return (
    <>
      <div className="bg-background relative overflow-hidden rounded-lg border p-5 shadow-sm">
        {isLoading ? (
          <div className="bg-background/60 absolute inset-0 z-10  flex items-center justify-center backdrop-blur-sm">
            <Spinner className=" size-8" />
          </div>
        ) : (
          <Table className={isLoading ? "pointer-events-none opacity-60" : ""}>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Nama User</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Tipe Transaksi</TableHead>
                <TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaksi?.map((item: ITransaksi) => (
                <TableRow
                  key={item.id}
                  className={
                    item.tipe_transaksi === "KELUAR"
                      ? "bg-red-200"
                      : item.tipe_transaksi === "MASUK"
                        ? "bg-green-200"
                        : ""
                  }
                >
                  <TableCell>{item.barang?.nama}</TableCell>
                  <TableCell>{item.users?.name}</TableCell>
                  <TableCell>{item.jumlah}</TableCell>
                  <TableCell>{item.tipe_transaksi}</TableCell>
                  <TableCell>
                    {new Date(item.tanggal).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default TabelTransaksi;
