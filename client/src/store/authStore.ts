import { create } from "zustand";
import { usersApi } from "@/api/users";
import { errorMessage } from "@/lib/api";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "ready";
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

// set is used to change the state inside the store.
export const useAuthStore = create<AuthState>((set) => ({
  // initial state
  user: null,
  status: "idle", // What is the auth system currently doing?

  hydrate: async () => {
    set({ status: "loading" });
    try {
      const user = await usersApi.getProfile();
      set({ user, status: "ready" });
    } catch {
      set({ user: null, status: "ready" });
    }
  },

  login: async (email, password) => {
    try {
      const user = await usersApi.login(email, password);
      set({ user, status: "ready" });
    } catch (error) {
      throw new Error(errorMessage(error), { cause: error });
    }
  },

  register: async (username, email, password) => {
    try {
      const user = await usersApi.register(username, email, password);
      set({ user, status: "ready" });
    } catch (error) {
      throw new Error(errorMessage(error), { cause: error });
    }
  },

  logout: async () => {
    try {
      await usersApi.logout();
    } finally {
      set({ user: null });
    }
  },

  setUser: (user) => set({ user }),
}));
