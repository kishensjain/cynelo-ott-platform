import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { Request } from "express";

const normalizePagination = (req: Request) => {
  const page = Math.max(
    Number.parseInt(String(req.query.page || ""), 10) || 1,
    1,
  );
  const limit = Math.min(
    Math.max(Number.parseInt(String(req.query.limit || ""), 10) || 20, 1),
    50,
  );
  return { page, limit, skip: (page - 1) * limit };
};
