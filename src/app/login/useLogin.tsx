import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authServices from "@/services/auth.sevices";
import { ILogin, ILoginResponse, ApiErrorResponse } from "@/types/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Skema validasi Yup
const schema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  password: yup.string().min(6, "Password minimal 6 karakter").required(),
});

const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();

  // Mutation untuk login
  const { mutate: mutateAuthLogin, isPending: isPendingMutateAuthLogin } =
    useMutation<ILoginResponse, AxiosError<ApiErrorResponse>, ILogin>({
      mutationFn: async (payload: ILogin) => {
        const response = await authServices.login(payload);
        return response.data; // Return data langsung, bukan AxiosResponse
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        const errorMessage =
          error.response?.data?.error || error.message || "Login gagal";
        toast.error(errorMessage);
      },
      onSuccess: (data: ILoginResponse) => {
        // Data sudah ILoginResponse
        toast.success("Login berhasil");
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      },
    });

  // Handler untuk submit form
  const handleOnSubmit = (payload: ILogin) => {
    mutateAuthLogin(payload);
  };

  // Kembalikan nilai yang diperlukan untuk komponen
  return {
    register,
    handleSubmit: handleSubmit(handleOnSubmit),
    errors,
    isPendingMutateAuthLogin,
  };
};

export default useLogin;
