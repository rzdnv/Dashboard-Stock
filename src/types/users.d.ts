interface IUser {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "OPERATOR";
}

export { IUser };
