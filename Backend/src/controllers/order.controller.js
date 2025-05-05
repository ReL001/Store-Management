import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrder = async (req, res) => {
  try {
    const { ginDetails, vendorDetails, items } = req.body;

    // Validate GIN details
    if (
      !ginDetails?.ginNumber ||
      !ginDetails?.date ||
      !ginDetails?.department ||
      !ginDetails?.billNumber
    ) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "GIN details (number, date, department, bill number) are required"
          )
        );
    }

    // Validate vendor details
    if (
      !vendorDetails?.name ||
      !vendorDetails?.contactNumber ||
      !vendorDetails?.gstin ||
      !vendorDetails?.address
    ) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Vendor details (name, number, contact, GSTIN, address) are required"
          )
        );
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Order must include at least one item"));
    }

    for (const item of items) {
      if (
        !item.name ||
        !item.quantity ||
        item.quantity < 1 ||
        !item.unitPrice ||
        item.unitPrice < 0
      ) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Each item must have a name, valid quantity, and valid unitPrice"
            )
          );
      }
    }

    // Create and save order
    const newOrder = new Order({
      ginDetails,
      vendorDetails,
      items,
      createdBy: req.user._id,
    });

    const savedOrder = await newOrder.save();

    return res
      .status(201)
      .json(new ApiResponse(201, savedOrder, "Order created successfully"));
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export const updateOrder = async (req, res) => {
  console.log("upading");
  try {
    const { id } = req.params;
    console.log(id);

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

    // Find the order by ID and update it with new data
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        items,
        vendor,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

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
    const { id } = req.params;

    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(id);

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

export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 }) // Most recent first
      .limit(3);

    res
      .status(200)
      .json(
        new ApiResponse(200, recentOrders, "Recent orders fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const getOrders = async (req, res) => {
  try {
    // Get optional query parameters for filtering (status, vendor, etc.)
    const { status, vendor, limit = 10, page = 1 } = req.query;

    // Create the filter object based on provided query params
    const filter = {};

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Filter by vendor if provided
    if (vendor) {
      filter.vendor = vendor;
    }

    // Pagination: Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch the orders with the applied filters and pagination
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    // Count total orders (for pagination purposes)
    const totalOrders = await Order.countDocuments(filter);

    // Send the response with the orders and total count
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { orders, totalOrders },
          "Orders fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new ApiError(500, "Internal server error");
  }
};
