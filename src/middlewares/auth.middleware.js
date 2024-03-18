import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
   const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

   if (!token) {
      next(new ApiError(401, "Unauthorized request"));
   }
   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   if (!decodedToken) {
      next(new ApiError(401, "Unauthorized request"));
   }
   const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
   );

   if (!user) {
      next(new ApiError(401, "Invalid access token"));
   }

   req.user = user;
   next();
});

export { verifyJwt };
