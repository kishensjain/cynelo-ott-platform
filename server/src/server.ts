import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

dotenv.config({debug: true});

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Disable the X-Powered-By header
app.disable("x-powered-by");
//helmet is an Express middleware that sets various HTTP security headers.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

// Express's middleware for handling JSON request bodies.
app.use(express.json({ limit: "1mb" }));
// Express's middleware for handling URL-encoded request bodies like form data.
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// Express's middleware for handling cookies
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Cynelo API",
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Cynelo API running on http://localhost:${PORT}`);
  });
};

startServer();
