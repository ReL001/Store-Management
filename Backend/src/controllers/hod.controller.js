import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";

export const ApproveOrder = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role != "hod") {
    throw new ApiError(401, "You are not allowed to access this resource!");
  }

  const { id } = req.params;

  const currentOrder = await Order.findById(id);

  const { toApprove } = req.body;

  try {
    if (toApprove) {
      currentOrder.status = "approved";
      currentOrder.approvedBy = user._id;
      await currentOrder.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Order approved successfully"));
    } else {
      currentOrder.status = "rejected";
      currentOrder.approvedBy = user._id;
      await currentOrder.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Order rejected successfully"));
    }
  } catch (error) {
    throw new Error(500, "Error updating status");
  }
});
