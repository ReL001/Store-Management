import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { departmentEnum, User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error?.message || "Error generating tokens");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, fullName, password, role, department } = req.body;
  console.log(req.body);

  // Check for empty required fields
  if ([email, fullName, password, role].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  if (role !== "manager") {
    if (!department) {
      throw new ApiError(400, "Department is required for HOD users");
    }
    if (!departmentEnum.includes(department)) {
      throw new ApiError(400, {
        message: "Invalid department",
        validDepartments: departmentEnum,
      });
    }
  }

  // Check for existing users
  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  //Create user
  const userData = {
    email,
    fullName,
    password,
    role,
    ...(role !== "manager" && { department }),
  };
  const user = await User.create(userData);

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
  //Get data from user
  const { email, password } = req.body;

  //Validate data
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  //Authentication
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  //Generate access & refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // console.log(generateAccessAndRefreshTokens(user._id));

  //set cookies and send response
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      user: user,
      accessToken,
    });
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

export const getUserProfile = asyncHandler(async (req, res) => {
  // Use the authenticated user's ID from the middleware
  const userId = req.user._id;
  
  // Find user but exclude sensitive information
  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { fullName, email, currentPassword, newPassword, department } = req.body;

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update basic fields if provided
  if (fullName) user.fullName = fullName;
  
  // Handle email update - check if new email is already in use
  if (email && user.email !== email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }
    user.email = email;
  }

  // Handle department update for HOD users
  if (department && user.role === "hod") {
    if (!departmentEnum.includes(department)) {
      throw new ApiError(400, {
        message: "Invalid department",
        validDepartments: departmentEnum,
      });
    }
    user.department = department;
  }

  // Handle password update
  if (currentPassword && newPassword) {
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }
    // Update password
    user.password = newPassword;
  }

  // Save user changes
  await user.save();

  // Return updated user without sensitive information
  const updatedUser = await User.findById(userId).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
