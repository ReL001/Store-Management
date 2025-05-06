import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyToken = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // Updated token check
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new ApiError(401, "Unauthorized request: Token missing or invalid format");
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error("FATAL: ACCESS_TOKEN_SECRET is not defined in environment variables.");
      throw new ApiError(500, "Internal server configuration error: Access token secret missing.");
    }

    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedUser?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});
