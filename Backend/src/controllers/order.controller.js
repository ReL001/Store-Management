import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createOrder = async (req, res) => {
  try {
    const { ginDetails, vendor, items } = req.body;

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
    if (!vendor) {
      return res.status(400).json(new ApiError(400, "Vendor is required"));
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

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);

    // Create and save order
    const newOrder = new Order({
      ginDetails,
      vendor,
      items,
      totalPrice,
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
  // console.log("upading");
  try {
    const { id } = req.params;
    // console.log(id);

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
    const user = req.user;

    const filter = {};

    if (user.role === "hod" && user.department) {
      filter["ginDetails.department"] = user.department;
      // console.log(`Applying HOD department filter: ${user.department}`);
    }

    const recentOrders = await Order.find(filter)
      .populate([
        {
          path: "vendor",
          select: "name phone email gstin address",
          model: "Vendor",
        },
        {
          path: "createdBy",
          select: "fullName",
          model: "User",
        },
      ])
      .sort({ createdAt: -1 }) // Most recent first
      .limit(3);

    // console.log(recentOrders);

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
    // Get optional query parameters for filtering
    const { status, vendor, limit = 10, page = 1 } = req.query;
    const user = req.user;

    // Debug: Log the user and their department
    // console.log("Current user:", {
    //   _id: user._id,
    //   role: user.role,
    //   department: user.department,
    // });

    // Create the filter object
    const filter = {};

    // [FIXED] Always filter by user's department for HODs
    if (user.role === "hod" && user.department) {
      filter["ginDetails.department"] = user.department;
      // console.log(`Applying HOD department filter: ${user.department}`);
    }

    // Allow management to optionally filter by department
    if (user.role === "management" && req.query.department) {
      filter["ginDetails.department"] = req.query.department;
      // console
      //   .log
      //   `Applying management department filter: ${req.query.department}`
      //   ();
    }

    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

    // Filter by vendor if provided
    if (vendor) {
      filter.vendor = vendor;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Debug: Log the final filter
    // console.log("Final query filter:", JSON.stringify(filter, null, 2));

    // Fetch orders
    const orders = await Order.find(filter)
      .populate([
        {
          path: "vendor",
          select: "name phone email gstin address",
          model: "Vendor",
        },
        {
          path: "createdBy",
          select: "fullName email", // Ensure these match User schema
          model: "User", // Explicitly declare model
        },
      ])
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments(filter);

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
