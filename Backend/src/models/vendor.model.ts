import mongoose from 'mongoose';

export interface IVendor {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  products: string[];
  rating: number;
  totalOrders: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new mongoose.Schema<IVendor>(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    products: [{
      type: String,
      trim: true,
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema); 