import type { HydratedDocument } from "mongoose";
import type { IUser } from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>;
    }
  }
}

export {};

// Here we are adding a custom user property to Express's Request object.