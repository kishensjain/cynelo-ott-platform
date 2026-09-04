import express from "express";
import upload from "../middlewares/upload.middleware.js";

import {
  createMovie,
  getAllMovies,
  searchMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteReview,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
} from "../controllers/movie.controller.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

import checkId from "../middlewares/checkId.middleware.js";

const router = express.Router();

router.get("/search", searchMovies);
router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", checkId, getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);

router.post("/:id/reviews", authenticate, checkId, movieReview);

router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  createMovie,
);

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  checkId,
  upload.single("image"),
  updateMovie,
);

router.delete("/:id", authenticate, authorizeAdmin, checkId, deleteMovie);

router.delete("/delete-review", authenticate, authorizeAdmin, deleteReview);

export default router;
