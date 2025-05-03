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

export interface Order {
  _id: string;
  ginDetails: GinDetails;
  vendorDetails: VendorDetails;
  items: OrderItem[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface OrdersData {
  orders: Order[];
  totalOrders: number;
}
