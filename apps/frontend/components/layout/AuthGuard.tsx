"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/app/providers";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isAuthPage = pathname?.startsWith("/auth");

    if (!user && !isAuthPage) {
      router.replace("/auth/login");
    } else if (user && isAuthPage) {
      router.replace("/");
    }
  }, [user, pathname, router, isMounted]);

  // Prevent hydration mismatch and hide content until mounted/checked
  if (!isMounted) return null;

  // Don't render protected content if not authenticated (unless on auth pages)
  if (!user && !pathname?.startsWith("/auth")) {
    return null;
  }

  return <>{children}</>;
}
