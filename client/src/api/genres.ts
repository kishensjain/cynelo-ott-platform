import api from "@/lib/api";
import type { Genre } from "@/types";

export const genresApi = {
  getAll: () => api.get<Genre[]>("/genre").then((res) => res.data),

  getOne: (id: string) =>
    api.get<Genre>(`/genre/${id}`).then((res) => res.data),

  create: (name: string) =>
    api.post<Genre>("/genre", { name }).then((res) => res.data),

  update: (id: string, name: string) =>
    api.put<Genre>(`/genre/${id}`, { name }).then((res) => res.data),

  remove: (id: string) =>
    api.delete<{ message: string }>(`/genre/${id}`).then((res) => res.data),
};
