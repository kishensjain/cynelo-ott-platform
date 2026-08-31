import type { RequestHandler } from "express";

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;

/*
(req, res, next) => {
   // do something
}
This is a typical Express request handler.

.catch(next) is conceptually 
.catch((error) => {
  next(error);
})
*/
