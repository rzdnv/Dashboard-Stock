"use client";

import barangServices from "@/services/barang.services";
import { IBarang } from "@/types/barang";
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

const Barang = () => {
  const getListBarang = async () => {
    const { data } = await barangServices.getBarang();
    return data;
  };
  const {
    data: barang,
    isLoading,
    // error,
  } = useQuery({
    queryKey: ["barang"],
    queryFn: () => getListBarang(),
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
                <TableHead>Nama barang</TableHead>
                <TableHead>Kode barang</TableHead>
                <TableHead>Lokasi rak</TableHead>
                <TableHead>Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barang.map((item: IBarang) => (
                <TableRow
                  key={item.id}
                  className={
                    item.stok < 10
                      ? "bg-red-300"
                      : item.stok === 10
                        ? "bg-orange-300"
                        : ""
                  }
                >
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.kode}</TableCell>
                  <TableCell>{item.lokasi_rak}</TableCell>
                  <TableCell>{item.stok}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default Barang;
