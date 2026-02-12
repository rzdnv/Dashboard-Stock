// hooks/useAuth.ts
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: number;
  username: string;
  role: string;
}

export const useAuth = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("auth-token");
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.NEXT_PUBLIC_JWT_SECRET || "",
        ) as DecodedToken;
        setRole(decoded.role);
      } catch {
        setRole(null);
      }
    }
  }, []);

  return { role };
};
