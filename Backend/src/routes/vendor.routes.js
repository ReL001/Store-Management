import Router from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { checkManagerRole } from "../middleware/managerAuth.middleware.js";
import {
  createVendor,
  deleteVendor,
  getVendorById,
  getVendors,
  linkOrderToVendor,
  updateVendor,
} from "../controllers/vendor.controller.js";

const router = Router();

// Create vendor - only store manager can create vendors
router.route("/create").post(verifyToken, checkManagerRole, createVendor);

// Get all vendors - any authenticated user can view vendors
router.route("/").get(verifyToken, getVendors);

// Get, update, delete vendor by ID
router.route("/:id").get(verifyToken, getVendorById);
router.route("/:id").put(verifyToken, checkManagerRole, updateVendor);
router.route("/:id").delete(verifyToken, checkManagerRole, deleteVendor);

// Link order to vendor
router.route("/:vendorId/link-order/:orderId").post(verifyToken, checkManagerRole, linkOrderToVendor);

export default router;