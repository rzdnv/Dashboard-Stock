import axios from "axios";

const barangServices = {
  getBarang: () => axios.get("/api/barang"),
};

export default barangServices;
