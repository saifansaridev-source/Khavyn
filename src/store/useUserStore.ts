import { create } from "zustand";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
}

interface UserState {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: SessionUser | null) => void;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isLoading: false }),

  setLoading: (loading) => set({ isLoading: loading }),

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
