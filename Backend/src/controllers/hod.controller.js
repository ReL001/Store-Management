import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";

export const handleOrderAction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, message } = req.body; // message only used for 'request_changes'
  const user = req.user;

  const update = {
    status:
      action === "approve"
        ? "approved"
        : action === "reject"
          ? "rejected"
          : action === "quotation_requested" // Add this case
            ? "quotation_requested"
            : "changes_requested", // Default fallback
    approvedBy: user._id,
    updatedAt: new Date(),
  };

  // Only add message if requesting changes
  if (action === "request_changes") {
    update.requestedChanges = message || "Changes requested";
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true }
  );

  if (!order) throw new ApiError(404, "Order not found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        `Order ${action.replace("_", " ")} successful`
      )
    );
});
