import mongoose from "mongoose";

export interface IGenre {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
const genreSchema = new mongoose.Schema<IGenre>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true },
);
const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
