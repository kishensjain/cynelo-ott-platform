import Genre from "../models/genre.model.js";
import Movie from "../models/movie.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Escapes special regex characters in a string so the value can be safely used in a regular expression as literal text instead of being interpreted as regex syntax. For example, "Iron Man (2008)" becomes "Iron Man \\(2008\\)".
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createGenre = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  const existing = await Genre.findOne({
    name: new RegExp(`^${escapeRegex(name)}$`, "i"),
  });
  if (existing) {
    res.status(409);
    throw new Error("Genre already exists");
  }
  res.status(201).json(await Genre.create({ name }));
});

export const updateGenre = asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }
  const duplicate = await Genre.findOne({
    name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    _id: { $ne: req.params.id },
  });
  if (duplicate) {
    res.status(409);
    throw new Error("Genre already exists");
  }
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404);
    throw new Error("Genre not found");
  }
  genre.name = name;
  res.json(await genre.save());
});

export const removeGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404);
    throw new Error("Genre not found");
  }
  const moviesUsingGenre = await Movie.countDocuments({ genre: genre._id });
  if (moviesUsingGenre > 0) {
    res.status(409);
    throw new Error(
      `Cannot delete genre while ${moviesUsingGenre} movie(s) use it`,
    );
  }
  await genre.deleteOne();
  res.json({ message: "Genre deleted successfully" });
});

export const listGenres = asyncHandler(async (_req, res) => {
  const genres = await Genre.find({}).sort({ name: 1 });
  res.json(genres);
});

export const readGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    res.status(404);
    throw new Error("Genre not found");
  }
  res.json(genre);
});