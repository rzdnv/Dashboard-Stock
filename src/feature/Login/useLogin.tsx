import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query"; // Tambah useMutation
import authServices from "@/services/auth.sevices";
import { ILogin } from "@/types/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

const schema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  password: yup.string().min(6, "Password minimal 6 karakter").required(),
});

const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ILogin>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  // Mutation untuk login
  const loginMutation = useMutation({
    mutationFn: authServices.login,
    onSuccess: (data) => {
      const { user, token } = data.data;

      // Simpan token dan user ke localStorage
      localStorage.setItem("auth-token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login berhasil");
      // Redirect berdasarkan role
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "OPERATOR") {
        router.push("/operator/dashboard");
      } else {
        router.push("/admin/dashboard"); // Default
      }
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(
        "Login gagal: " + (error.response?.data?.error || "Terjadi kesalahan"),
      );
      setError("root", { message: "Username atau password salah" });
    },
  });

  const handleOnSubmit = (payload: ILogin) => {
    loginMutation.mutate(payload);
  };

  return {
    register,
    handleSubmit: handleSubmit(handleOnSubmit),
    errors,
    isPendingMutateAuthLogin: loginMutation.isPending,
  };
};

export default useLogin;
