import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/db.js";

dotenv.config({debug: true});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to Cynelo API",
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Cynelo API running on http://localhost:${PORT}`);
  });
};

startServer();
