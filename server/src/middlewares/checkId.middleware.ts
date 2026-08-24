import { isValidObjectId } from "mongoose";
import { Request, Response, NextFunction } from "express";

export function checkId(req: Request, res: Response, next: NextFunction) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: `Invalid id: ${req.params.id}` });
  }
  next();
}
