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

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
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
      enum: [
        "pending",
        "approved",
        "rejected",
        "request_changes",
        "quotation_requested",
      ],
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
