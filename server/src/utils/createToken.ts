import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { Types } from "mongoose";

const generateToken = (res: Response, userId: Types.ObjectId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");

  // userId is not a string initially
  const token = jwt.sign({ userId: userId.toString() }, secret, {
    expiresIn: "30d",
  });

  // A cookie is a small piece of data that a website asks your browser to store, think of it like a small note that the browser keeps for a website.
  res.cookie("jwt", token, {
    httpOnly: true, // inaccessible to client-side JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;

/*
JWT Token - The actual authentication token
Cookie - A place where the browser can store that token

httpOnly - JavaScript can't read cookie
secure   - Cookie requires HTTPS
maxAge - measured in milliseconds( 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds which is 30 days)
*/

/*
Flow
Suppose you log in:

1. Browser → Server
   "Here are my email + password"

2. Server
   verifies credentials ✅

3. Server
   creates JWT

4. Server → Browser
   "Store this JWT as a cookie"

5. Browser
   stores the cookie

Now later:

6. Browser → Server
   "Give me my profile"
   + cookie containing JWT

7. Server
   receives the JWT

8. Server
   verifies the JWT using JWT_SECRET

9. Server
   JWT is valid ✅
   ↓
   Server gets userId
   ↓
   Finds that user's data
   ↓
   Sends response
*/
