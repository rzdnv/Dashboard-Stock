export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginResponse {
  success: boolean;
  user: { id: number; name: string; role: string };
  token: string; // Pastikan ada
}

export interface ApiErrorResponse {
  error: string;
}
