import Router from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyToken, getUserProfile);
router.route("/profile/update").put(verifyToken, updateUserProfile);

export default router;
