import { ILogin } from "@/types/auth";
import axios from "axios";

const authServices = {
  login: (payload: ILogin) => axios.post("/api/auth/login", payload),
};

export default authServices;
