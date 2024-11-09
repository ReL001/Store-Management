import Router from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyToken, createOrder);

export default router;
