import Router from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
