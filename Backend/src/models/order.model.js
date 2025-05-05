import mongoose from "mongoose";

// Define the Order schema with an array of items

const orderSchema = new mongoose.Schema(
  {
    // GIN (Goods Issue Note) Details
    ginDetails: {
      ginNumber: { type: String, required: true, trim: true },
      date: { type: Date, required: true }, // Store as Date for easier querying
      department: {
        type: String,
        required: true,
        trim: true,
        enum: [
          "Computer Science",
          "Electronics",
          "Mechanical",
          "Civil",
          "Biotech",
        ],
      },

      billNumber: { type: String, required: true, trim: true },
    },

    // Vendor Details (nested object)
    vendorDetails: {
      name: { type: String, required: true, trim: true }, // Existing 'vendor' field upgraded
      contactNumber: { type: String, required: true, trim: true },
      gstin: { type: String, required: true, trim: true }, // GSTIN is alphanumeric (e.g., "22ABCDE1234F1Z5")
      address: { type: String, required: true, trim: true },
    },

    // Items Array (enhanced with unit details)
    items: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: "" },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 }, // Renamed from 'price' for clarity
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },

    // Approval Metadata (unchanged)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedChanges: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Order = mongoose.model("Order", orderSchema);
