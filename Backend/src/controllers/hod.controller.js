import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const ApproveOrder = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role != "hod") {
    throw new ApiError(401, "You are not allowed to access this resource!");
  }

  const { id } = req.params;

  const currentOrder = await Order.findById(id);

  const status = currentOrder.status;

  const toApprove = req.body;

  try {
    if (toApprove) {
      currentOrder.status = "approved";
      await currentOrder.save();
    } else {
      currentOrder.status = "rejected";
      await currentOrder.save();
      return res
        .status(200)
        .json(new ApiResponse(200, "Status updated successfully"));
    }
  } catch (error) {
    throw new Error(500, "Error updating status");
  }
});
