import Router from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createOrder,
  deleteOrder,
  forwardOrder,
  getOrders,
  updateOrder,
} from "../controllers/order.controller.js";
import { handleOrderAction } from "../controllers/hod.controller.js";
import { checkManagerRole } from "../middleware/managerAuth.middleware.js";
import { getRecentOrders } from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(verifyToken, checkManagerRole, createOrder);
router.route("/update/:id").put(verifyToken, checkManagerRole, updateOrder);
router.route("/delete/:id").delete(verifyToken, checkManagerRole, deleteOrder);
router.route("/handleOrder/:id").patch(verifyToken, handleOrderAction);
router.route("/recent").get(verifyToken, getRecentOrders);
router.route("/").get(verifyToken, getOrders);
router.route("/:orderId/forward").post(verifyToken, forwardOrder);

export default router;
