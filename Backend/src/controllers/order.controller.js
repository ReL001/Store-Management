import { Order } from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    // Extract order details from the request body
    const { items, vendor } = req.body;

    // Validate that items are provided
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must include at least one item" });
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
        return res.status(400).json({
          error: "Each item must have a name, valid quantity, and valid price",
        });
      }
    }

    // Create a new order
    const newOrder = new Order({
      items,
      vendor,
      createdBy: req.user._id, // Assuming `req.user` is set after authentication middleware
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Return the saved order as a response
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
