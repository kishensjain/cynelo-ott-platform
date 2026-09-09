import api from "@/lib/api";
import type { User } from "@/types";

export const usersApi = {
  register: (username: string, email: string, password: string) =>
    api
      .post<User>("/users", { username, email, password })
      .then((res) => res.data),

  login: (email: string, password: string) =>
    api.post<User>("/users/auth", { email, password }).then((res) => res.data),

  logout: () =>
    api.post<{ message: string }>("/users/logout").then((res) => res.data),

  getProfile: () => api.get<User>("/users/profile").then((res) => res.data),

  updateProfile: (data: {
    username?: string;
    email?: string;
    password?: string;
  }) => api.put<User>("/users/profile", data).then((resizeBy) => resizeBy.data),

  getAll: () => api.get<User[]>("/users").then((resizeBy) => resizeBy.data),
};

// <User> applies to the RECEIVE side, not the SEND side