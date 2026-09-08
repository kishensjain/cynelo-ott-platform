export interface Genre {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Movie {
  _id: string;
  name: string;
  image: string;
  imagePublicId?: string;
  year: number;
  genre: Genre | string;
  detail: string;
  cast: string[];
  reviews: Review[];
  numReviews: number;
  rating: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedMovies {
  movies: Movie[];
  page: number;
  limit: number;
  total: number;
  pages: number;
  query?: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface ApiError {
  message: string;
}
