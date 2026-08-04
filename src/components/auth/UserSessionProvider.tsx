"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export function UserSessionProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useUserStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <>{children}</>;
}
