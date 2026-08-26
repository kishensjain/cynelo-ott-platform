import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload & { userId: string };

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    // attaches the authenticated user to the Express request object
    (req as Request & { user: typeof user }).user = user;
    next();
  } catch (error: any) {
    if (error?.statusCode === 401 || res.statusCode === 401) throw error;
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

export const authorizeAdmin = (
  req: Request & { user?: { isAdmin?: boolean } },
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: "Not authorized as an admin" });
};
