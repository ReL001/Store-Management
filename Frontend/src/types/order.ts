// src/types/orders.ts
export interface GinDetails {
  ginNumber: string;
  date: string;
  department: string;
  billNumber: string;
}

export interface VendorDetails {
  name: string;
  contactNumber: string;
  gstin: string;
  address: string;
}

export interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type UserReference =
  | string
  | {
      _id: string;
      fullName: string;
      email: string;
    };

export interface Order {
  _id: string;
  ginDetails: GinDetails;
  vendorDetails: VendorDetails;
  items: OrderItem[];
  totalPrice: Number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  createdBy?: UserReference | string; // Added createdBy property as optional
}

export interface OrdersData {
  orders: Order[];
  totalOrders: number;
}
