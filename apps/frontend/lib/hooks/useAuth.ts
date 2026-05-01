import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { useAuthContext } from "@/app/providers";

// ─── Shared types ─────────────────────────────────────────────────────────────
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

// ─── useSignup ────────────────────────────────────────────────────────────────
interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

export function useSignup() {
  const { setSession } = useAuthContext();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupInput) =>
      apiFetch<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true,
      }),
    onSuccess: ({ user, accessToken }) => {
      setSession(user, accessToken);
      router.push("/");
    },
  });
}

// ─── useLogin ─────────────────────────────────────────────────────────────────
interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  const { setSession } = useAuthContext();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) =>
      apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        skipAuth: true,
      }),
    onSuccess: ({ user, accessToken }) => {
      setSession(user, accessToken);
      router.push("/");
    },
  });
}

// ─── useLogout ────────────────────────────────────────────────────────────────
export function useLogout() {
  const { clearSession } = useAuthContext();
  const router = useRouter();

  return useMutation({
    mutationFn: () =>
      apiFetch("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      clearSession();
      router.push("/auth/login");
    },
    onError: () => {
      // Even if the request fails, clear the local session
      clearSession();
      router.push("/auth/login");
    },
  });
}
