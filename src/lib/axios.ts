import axios from "axios";

// Setup base URL jika perlu (opsional)
axios.defaults.baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Interceptors untuk request
axios.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptors untuk response (opsional, untuk handle error global)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear storage dan redirect
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axios;
