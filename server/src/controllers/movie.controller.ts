import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { Request } from "express";
import cloudinary from "../config/cloudinary.js";

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

export const createMovie = asyncHandler(async (req, res) => {
  const { name, year, genre, detail, cast = [] } = req.body;

  if (!name || !year || !genre || !detail) {
    res.status(400);
    throw new Error("name, year, genre and detail are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Movie image is required");
  }

  const genreExists = await Genre.findById(genre);

  if (!genreExists) {
    res.status(400);
    throw new Error("Genre not found");
  }

  const result = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    {
      folder: "movies",
    },
  );

  const movie = await Movie.create({
    name,
    image: result.secure_url,
    imagePublicId: result.public_id,
    year,
    genre,
    detail,
    cast,
  });

  res.status(201).json(movie);
});

export const getAllMovies = asyncHandler(async (req, res) => {
  const { page, limit, skip } = normalizePagination(req);

  const [movies, total] = await Promise.all([
    Movie.find()
      .populate("genre", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Movie.countDocuments(),
  ]);

  res.json({
    movies,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

export const searchMovies = asyncHandler(async (req, res) => {
  const { page, limit, skip } = normalizePagination(req);

  const query = String(req.query.query || req.query.q || "").trim();
  const genre = String(req.query.genre || "").trim();
  const year = Number.parseInt(String(req.query.year || ""), 10);

  const filter: Record<string, any> = {};

  if (query) {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { name: { $regex: safeQuery, $options: "i" } },
      { detail: { $regex: safeQuery, $options: "i" } },
      { cast: { $regex: safeQuery, $options: "i" } },
    ];
  }

  if (genre) filter.genre = genre;

  if (Number.isInteger(year)) filter.year = year;

  const [movies, total] = await Promise.all([
    Movie.find(filter)
      .populate("genre", "name")
      .sort({ rating: -1, numReviews: -1, name: 1 })
      .skip(skip)
      .limit(limit),

    Movie.countDocuments(filter),
  ]);

  res.json({
    movies,
    query,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  });
});

export const getSpecificMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id)
    .populate("genre", "name")
    .populate("reviews.user", "username");

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.json(movie);
});

export const updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const allowed = ["name", "year", "genre", "detail", "cast"];

  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      movie[field] = req.body[field];
    }
  });

  if (req.body.genre !== undefined) {
    const genreExists = await Genre.exists({ _id: req.body.genre });

    if (!genreExists) {
      res.status(400);
      throw new Error("Genre not found");
    }
  }

  if (req.file) {
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "movies",
      },
    );

    if (movie.imagePublicId) {
      await cloudinary.uploader.destroy(movie.imagePublicId);
    }

    movie.image = result.secure_url;
    movie.imagePublicId = result.public_id;
  }

  res.json(await movie.save());
});

export const movieReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const numericRating = Number(rating);

  if (
    !Number.isFinite(numericRating) ||
    numericRating < 1 ||
    numericRating > 5 ||
    !comment?.trim()
  ) {
    res.status(400);
    throw new Error("Rating must be between 1 and 5 and comment is required");
  }

  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  if (
    movie.reviews.some(
      (review) => review.user.toString() === req.user._id.toString(),
    )
  ) {
    res.status(400);
    throw new Error("Movie already reviewed");
  }

  movie.reviews.push({
    name: req.user.username,
    rating: numericRating,
    comment: comment.trim(),
    user: req.user._id,
  });

  movie.numReviews = movie.reviews.length;

  movie.rating =
    movie.reviews.reduce((sum, item) => sum + item.rating, 0) /
    movie.reviews.length;

  await movie.save();

  res.status(201).json({
    message: "Review added",
    movie,
  });
});

export const deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  if (movie.imagePublicId) {
    await cloudinary.uploader.destroy(movie.imagePublicId);
  }

  await movie.deleteOne();

  res.json({
    message: "Movie deleted successfully",
  });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { movieId, reviewId } = req.body;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const reviewIndex = movie.reviews.findIndex(
    (review) => review._id.toString() === reviewId,
  );

  if (reviewIndex === -1) {
    res.status(404);
    throw new Error("Review not found");
  }

  movie.reviews.splice(reviewIndex, 1);

  movie.numReviews = movie.reviews.length;

  movie.rating = movie.numReviews
    ? movie.reviews.reduce((sum, item) => sum + item.rating, 0) /
      movie.numReviews
    : 0;

  await movie.save();

  res.json({
    message: "Review deleted successfully",
  });
});

export const getNewMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find()
    .populate("genre", "name")
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(movies);
});

export const getTopMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find()
    .populate("genre", "name")
    .sort({
      rating: -1,
      numReviews: -1,
      createdAt: -1,
    })
    .limit(10);

  res.json(movies);
});

export const getRandomMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.aggregate([
    {
      $sample: {
        size: 10,
      },
    },
  ]);

  res.json(movies);
});
