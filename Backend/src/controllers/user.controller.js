import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userInstance) => {
  try {
    const accessToken = userInstance.generateAccessToken();
    const refreshToken = userInstance.generateRefreshToken();

    userInstance.refreshToken = refreshToken;
    await userInstance.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshTokens:", error);
    throw new ApiError(
      500,
      error?.message || "Error generating tokens"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password, role } = req.body;
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
    role,
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

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    throw new ApiError(400, "Username/Email and password are required");
  }

  const userQuery = username ? { username } : { email };
  const user = await User.findOne(userQuery);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  // Pass the fetched 'user' object directly to generateAccessAndRefreshTokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

  // Prepare user object for the response, excluding sensitive information
  const loggedInUserForResponse = {
    _id: user._id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUserForResponse, accessToken },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get the refresh token from the request
  const currentRefreshToken = req.body.refreshToken || req.cookies.refreshToken;
  if (!currentRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    // Verify the refresh token
    const decodedUser = jwt.verify(
      currentRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedUser?._id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    //refresh tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    //send the new tokens
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        user: user,
        accessToken,
        refreshToken: newRefreshToken,
        message: "Access token refreshed successfully",
      });
  } catch (error) {
    throw new ApiError(500, error?.message || "Error refreshing tokens");
  }
});
