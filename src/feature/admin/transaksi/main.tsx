import FormTransaksi from "./FormTransaksi/FormTransaksi";
import TabelBarang from "./tabel/TabelBarang";
import TabelTransaksi from "./tabel/TabelTransaksi";

const Transaksi = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <TabelBarang />
        <FormTransaksi />
      </div>
      <TabelTransaksi />
    </div>
  );
};

export default Transaksi;
