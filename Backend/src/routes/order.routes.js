import Router from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyToken, createOrder);
router.route("/update").put(verifyToken, updateOrder);
router.route("/delete").delete(verifyToken, deleteOrder);

export default router;
