import Router from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  createOrder,
  deleteOrder,
  updateOrder,
} from "../controllers/order.controller.js";
import { ApproveOrder } from "../controllers/hod.controller.js";
import { checkManagerRole } from "../middleware/managerAuth.middleware.js";

const router = Router();

router.route("/create").post(verifyToken, checkManagerRole, createOrder);
router.route("/update/:id").put(verifyToken, checkManagerRole, updateOrder);
router.route("/delete/:id").delete(verifyToken, checkManagerRole, deleteOrder);
router.route("/approve/:id").patch(verifyToken, ApproveOrder);

export default router;
