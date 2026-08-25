import { Request, Response, NextFunction } from "express";

type AppError = Error & {
  code?: number;
  keyPattern?: Record<string, number>;
  errors?: Record<string, { message: string }>;
};

export const notFound = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const message = err?.message || "Internal server error";

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors || {}).map((item) => item.message),
    });
  }

  // A CastError commonly happens in Mongoose when you give MongoDB a value in the wrong format.
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  // 11000 is a duplicate key error
  if (err?.code === 11000) {
    // MongoDB often gives you information about which field caused the duplicate through keyPattern.
    const fields = Object.keys(err.keyPattern || {});

    return res
      .status(409) // 409 means conflict
      .json({ message: `${fields.join(", ")} already exists` });
  }

  return res.status(statusCode).json({ message });
};

/*
err.errors looks something like:
{
  email: {
    message: "Email is invalid"
  },
  age: {
    message: "Age must be a number"
  }
}
Object.values() ignores the property names (email, age) and gives you just the values:

[
  { message: "Email is invalid" },
  { message: "Age must be a number" }
]
*/
