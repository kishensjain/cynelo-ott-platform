import mongoose, { type Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMovie {
  name: string;
  image: string;
  year: number;
  genre: Types.ObjectId;
  detail: string;
  cast: string[];
  reviews: IReview[];
  numReviews: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

const movieSchema = new mongoose.Schema<IMovie>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    image: {
      type: String,
      default: "",
    },
    year: {
      type: Number,
      required: true,
      min: 1888,
      max: 2100,
    },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    detail: {
      type: String,
      trim: true,
      required: true,
    },
    cast: [
      {
        type: String,
        trim: true,
      },
    ],
    reviews: [reviewSchema],
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

movieSchema.index({ name: "text", detail: "text", cast: "text" });
movieSchema.index({ genre: 1, year: -1 });
movieSchema.index({ rating: -1, numReviews: -1 });
movieSchema.index({ createdAt: -1 });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
