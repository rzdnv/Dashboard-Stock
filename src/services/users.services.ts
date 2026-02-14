import axios from "@/lib/axios";

const usersServices = {
  getUsers: () => axios.get("/api/users"),
};
export default usersServices;
