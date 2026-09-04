import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, //Identifies your app/account
  api_secret: process.env.CLOUDINARY_API_SECRET, //Proves your app is authorized
});
export default cloudinary;