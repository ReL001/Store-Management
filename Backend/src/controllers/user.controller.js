import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;
  // Check for empty fields
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    console.log("empty fields");
    throw new ApiError(400, "All fields are required");
  }

  // Check for existing users
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(
      409,
      existingUser.username === username
        ? "Username already exists"
        : "Email already exists"
    );
  }

  //Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Error registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});
