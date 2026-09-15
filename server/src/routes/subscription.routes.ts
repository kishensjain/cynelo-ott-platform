import express from "express";
import {
  subscribeUser,
  unsubscribeUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/subscribe", authenticate, subscribeUser);
router.post("/unsubscribe", authenticate, unsubscribeUser);

export default router;
