import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

dotenv.config({debug: true});

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({ origin: FRONTEND_URL, credentials: true }));

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

app.use(notFound);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Cynelo API running on http://localhost:${PORT}`);
  });
};

startServer();
