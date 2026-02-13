"use client";

import usersServices from "@/services/users.services";
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
import { IUser } from "@/types/users";

const Users = () => {
  const getListUsers = async () => {
    const { data } = await usersServices.getUsers();
    return data;
  };
  const {
    data: users,
    isLoading,
    // error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getListUsers(),
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
                <TableHead>ID User</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((item: IUser) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default Users;
