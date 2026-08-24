import express from "express";

import {
  createGenre,
  updateGenre,
  removeGenre,
  listGenres,
  readGenre,
} from "../controllers/genre.controller.js";

import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

import checkId from "../middlewares/checkId.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(listGenres)
  .post(authenticate, authorizeAdmin, createGenre);

router
  .route("/:id")
  .get(checkId, readGenre)
  .put(authenticate, authorizeAdmin, checkId, updateGenre)
  .delete(authenticate, authorizeAdmin, checkId, removeGenre);

export default router;