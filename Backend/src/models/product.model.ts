import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  gin: string;
  date: Date;
  department: string;
  billNumber: string;
  items: {
    name: string;
    description: string;
    quantity: number;
  }[];
  vendor: {
    name: string;
    contact: string;
    address: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  totalAmount: number;
}

const productSchema = new Schema<IProduct>(
  {
    gin: {
      type: String,
      required: [true, 'Please provide GIN number'],
      unique: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide date'],
      default: Date.now,
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
    },
    billNumber: {
      type: String,
      required: [true, 'Please provide bill number'],
    },
    items: [{
      name: {
        type: String,
        required: [true, 'Please provide item name'],
      },
      description: {
        type: String,
        required: [true, 'Please provide item description'],
      },
      quantity: {
        type: Number,
        required: [true, 'Please provide quantity'],
        min: [1, 'Quantity must be at least 1'],
      },
    }],
    vendor: {
      name: {
        type: String,
        required: [true, 'Please provide vendor name'],
      },
      contact: {
        type: String,
        required: [true, 'Please provide vendor contact'],
      },
      address: {
        type: String,
        required: [true, 'Please provide vendor address'],
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
productSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => total + (item.quantity || 0), 0);
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema); 