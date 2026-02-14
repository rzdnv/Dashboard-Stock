"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLogin from "./useLogin"; // Pastikan path benar

export default function Login() {
  const { register, handleSubmit, errors, isPendingMutateAuthLogin } =
    useLogin();
  const router = useRouter();

  useEffect(() => {
    // Cek jika sudah ada token/session di localStorage, redirect ke dashboard sesuai role
    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user.role) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "OPERATOR") {
        router.push("/operator/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login ke Dashboard Stok</CardTitle>
          <CardDescription>
            Masukkan username dan password untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="Masukkan username"
                disabled={isPendingMutateAuthLogin}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Masukkan password"
                disabled={isPendingMutateAuthLogin}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {errors.root && (
              <p className="text-red-500 text-sm">{errors.root.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isPendingMutateAuthLogin}
            >
              {isPendingMutateAuthLogin ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
