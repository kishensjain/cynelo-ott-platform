import mongoose from "mongoose";
import type { Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isSubscribed: boolean;
  likedMovies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      required: true,
      default: false,
    },
    likedMovies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    }],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;
