import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/createToken.js";

const serializeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  isAdmin: user.isAdmin,
});

export const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(409);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username: username.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });
  generateToken(res, newUser._id);
  res.status(201).json(serializeUser(newUser));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({
    email: email?.trim().toLowerCase(),
  });

  if (
    !existingUser ||
    !(await bcrypt.compare(password || "", existingUser.password))
  ) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  generateToken(res, existingUser._id);
  res.json(serializeUser(existingUser));
});

export const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(serializeUser(user));
});

export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.body.username?.trim()) user.username = req.body.username.trim();
  if (req.body.email?.trim()) user.email = req.body.email.trim().toLowerCase();
  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }
    user.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await user.save();
  res.json(serializeUser(updatedUser));
});
