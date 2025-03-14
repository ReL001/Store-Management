import mongoose, { Document, Schema } from 'mongoose';

export interface IRequest extends Document {
  department: string;
  requester: mongoose.Types.ObjectId;
  items: {
    name: string;
    description: string;
    quantity: number;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  totalAmount: number;
  notes?: string;
}

const requestSchema = new Schema<IRequest>(
  {
    department: {
      type: String,
      required: [true, 'Please provide department'],
    },
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
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
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
requestSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => total + (item.quantity || 0), 0);
  next();
});

export const Request = mongoose.model<IRequest>('Request', requestSchema); 