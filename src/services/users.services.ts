import axios from "axios";

const usersServices = {
  getUsers: () => axios.get("/api/users"),
};

export default usersServices;
