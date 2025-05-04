import { Vendor } from "../models/vendor.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "express-async-handler";

// Create a new vendor
export const createVendor = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, address, gstin, additionalDetails } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      throw new ApiError(400, "Name, email, phone and address are required fields");
    }

    // Check if vendor already exists with the same email
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      throw new ApiError(409, "Vendor with this email already exists");
    }

    // Create a new vendor
    const newVendor = new Vendor({
      name,
      email,
      phone,
      address,
      gstin,
      additionalDetails,
      createdBy: req.user._id,
    });

    // Save the vendor to database
    const savedVendor = await newVendor.save();

    res
      .status(201)
      .json(new ApiResponse(201, savedVendor, "Vendor created successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error creating vendor: " + error.message);
  }
});

// Get all vendors
export const getVendors = asyncHandler(async (req, res) => {
  try {
    // Get optional query parameters for filtering
    const { search, limit = 10, page = 1 } = req.query;

    // Create the filter object based on provided query params
    const filter = {};

    // Search by name or email if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination: Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch vendors with filters and pagination
    const vendors = await Vendor.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Count total vendors (for pagination)
    const totalVendors = await Vendor.countDocuments(filter);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { vendors, totalVendors },
          "Vendors fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching vendors: " + error.message);
  }
});

// Get vendor by ID
export const getVendorById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id).populate("previousOrders");

    if (!vendor) {
      throw new ApiError(404, "Vendor not found");
    }

    res.status(200).json(
      new ApiResponse(200, vendor, "Vendor fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching vendor: " + error.message);
  }
});

// Update vendor
export const updateVendor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, gstin, additionalDetails } = req.body;

    // Find vendor by ID
    const vendor = await Vendor.findById(id);
    
    if (!vendor) {
      throw new ApiError(404, "Vendor not found");
    }

    // Check if updating email and if it already exists
    if (email && email !== vendor.email) {
      const existingVendor = await Vendor.findOne({ email });
      if (existingVendor) {
        throw new ApiError(409, "Vendor with this email already exists");
      }
    }

    // Update vendor
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      {
        name: name || vendor.name,
        email: email || vendor.email,
        phone: phone || vendor.phone,
        address: address || vendor.address,
        gstin: gstin || vendor.gstin,
        additionalDetails: additionalDetails || vendor.additionalDetails,
      },
      { new: true }
    );

    res
      .status(200)
      .json(new ApiResponse(200, updatedVendor, "Vendor updated successfully"));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Error updating vendor: " + error.message);
  }
});

// Delete vendor
export const deleteVendor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if (!deletedVendor) {
      throw new ApiError(404, "Vendor not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedVendor, "Vendor deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Error deleting vendor: " + error.message);
  }
});

// Link order to vendor
export const linkOrderToVendor = asyncHandler(async (req, res) => {
  try {
    const { vendorId, orderId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    
    if (!vendor) {
      throw new ApiError(404, "Vendor not found");
    }

    // Check if order already linked
    if (vendor.previousOrders.includes(orderId)) {
      throw new ApiError(409, "Order already linked to this vendor");
    }

    // Add order to vendor's previousOrders
    vendor.previousOrders.push(orderId);
    await vendor.save();

    res
      .status(200)
      .json(new ApiResponse(200, vendor, "Order linked to vendor successfully"));
  } catch (error) {
    throw new ApiError(500, "Error linking order to vendor: " + error.message);
  }
});