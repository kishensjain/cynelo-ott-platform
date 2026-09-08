import api from "@/lib/api";
import type { Movie, PaginatedMovies, SearchParams } from "@/types";

export const moviesApi = {
  getAll: (page = 1, limit = 20) =>
    api
      .get<PaginatedMovies>("/movies/all-movies", { params: { page, limit } })
      .then((r) => r.data),

  search: (params: SearchParams) =>
    api.get<PaginatedMovies>("/movies/search", { params }).then((r) => r.data),

  getOne: (id: string) =>
    api.get<Movie>(`/movies/specific-movie/${id}`).then((r) => r.data),

  getNew: () => api.get<Movie[]>("/movies/new-movies").then((r) => r.data),

  getTop: () => api.get<Movie[]>("/movies/top-movies").then((r) => r.data),

  getRandom: () =>
    api.get<Movie[]>("/movies/random-movies").then((r) => r.data),

  create: (formData: FormData) =>
    api.post<Movie>("/movies", formData).then((r) => r.data),

  update: (id: string, formData: FormData) =>
    api.put<Movie>(`/movies/${id}`, formData).then((r) => r.data),

  remove: (id: string) =>
    api.delete<{ message: string }>(`/movies/${id}`).then((r) => r.data),

  addReview: (id: string, rating: number, comment: string) =>
    api
      .post<{ message: string; movie: Movie }>(`/movies/${id}/reviews`, {
        rating,
        comment,
      })
      .then((r) => r.data),

  deleteReview: (movieId: string, reviewId: string) =>
    api
      .delete<{ message: string }>("/movies/delete-review", {
        data: { movieId, reviewId },
      })
      .then((r) => r.data),
};
