import express from "express";

import {
  createMovie,
  getAllMovies,
  searchMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
} from "../controllers/movie.controller.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

import {checkId} from "../middlewares/checkId.middleware.js";

const router = express.Router();

router.get("/search", searchMovies);
router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", checkId, getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);

router.post("/:id/reviews", authenticate, checkId, movieReview);

router.post("/create-movie", authenticate, authorizeAdmin, createMovie);

router.put(
  "/update-movie/:id",
  authenticate,
  authorizeAdmin,
  checkId,
  updateMovie,
);

router.delete(
  "/delete-movie/:id",
  authenticate,
  authorizeAdmin,
  checkId,
  deleteMovie,
);

router.delete("/delete-comment", authenticate, authorizeAdmin, deleteComment);

export default router;
