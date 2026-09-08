import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again."
    );
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export default api;
