import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrder = async (req, res) => {
  try {
    // Get order details from the request body
    const { items, vendor } = req.body;

    // Validate that items are provided
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Order must include at least one item");
    }

    // Validate that each item has required fields
    for (let item of items) {
      if (
        !item.name ||
        !item.quantity ||
        item.quantity < 1 ||
        !item.price ||
        item.price < 0
      ) {
        throw new ApiError(
          400,
          "Each item must have a name, valid quantity, and valid price"
        );
      }
    }

    // Create a new order
    const newOrder = new Order({
      items,
      vendor,
      createdBy: req.user._id,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json(new ApiResponse(201, savedOrder, "Order created successfully"));
  } catch (error) {
    console.error("Error creating order:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;

    // Find the order by ID and update it with new data
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      throw new ApiError(404, "Order not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order updated successfully"));
  } catch (error) {
    console.error("Error updating order:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      throw new ApiError(404, "Order not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedOrder, "Order deleted successfully"));
  } catch (error) {
    console.error("Error deleting order:", error);
    throw new ApiError(500, "Internal server error");
  }
};
