import Router from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../controllers/order.controller.js";
import { ApproveOrder } from "../controllers/hod.controller.js";
import { checkManagerRole } from "../middleware/managerAuth.middleware.js";
import { getRecentOrders } from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyToken, checkManagerRole, createOrder);
router.route("/update/:id").put(verifyToken, checkManagerRole, updateOrder);
router.route("/delete/:id").delete(verifyToken, checkManagerRole, deleteOrder);
router.route("/approve/:id").patch(verifyToken, ApproveOrder);
router.route("/recent").get(verifyToken, getRecentOrders);
router.route("/").get(verifyToken, getOrders);

export default router;
