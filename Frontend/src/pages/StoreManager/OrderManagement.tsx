import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  CropSquareSharp,
  Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import OrderForm from "./OrderForm";
import { useGetOrders } from "lib/react-query/hooks/useGetOrders";
import { Order, OrdersData } from "types/order";
import { useDeleteOrderMutation } from "lib/react-query/orderQueries";
import { toast } from "react-toastify";
import { Vendor } from "../../lib/react-query/vendorQueries";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Product {
  id: string;
  gin: string;
  date: string;
  department: string;
  billNo: string;
  vendor: Vendor;
  items: Item[];
  status: "pending" | "approved" | "rejected";
}

interface FormData {
  gin: string;
  date: string;
  department: string;
  billNo: string;
  vendor: Vendor;
  items: Item[];
}

interface GinDetails {
  ginNumber: string;
  date: string;
  department: string;
  billNumber: string;
}

interface VendorDetails {
  name: string;
  contactNumber: string;
  gstin: string;
  address: string;
}

interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

// interface Order {
//   _id: string;
//   ginDetails: GinDetails;
//   vendorDetails: VendorDetails;
//   items: OrderItem[];
//   status: "pending" | "approved" | "rejected";
//   createdAt: string;
//   updatedAt: string;
// }

// interface OrdersData {
//   orders: Order[];
//   totalOrders: number;
// }

const OrderManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogType, setDialogType] = useState<"product" | "order">("product");
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: totalOrders,
    isLoading: loadingTotal,
    isError: errorTotal,
  } = useGetOrders();

  // const orders: Order[] = totalOrders?.orders || [];
  const orders = (totalOrders?.orders || []) as Order[]; // Force type assertion
  const totalCount: number = totalOrders?.totalOrders || 0;

  // Handle pagination changes
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const {
    data: pendingOrders,
    isLoading: loadingPending,
    isError: errorPending,
  } = useGetOrders("pending");
  const pendingCount = pendingOrders?.totalOrders || 0;

  const {
    data: rejectedOrders,
    isLoading: loadingRejected,
    isError: errorRejecting,
  } = useGetOrders("rejected");
  const rejectedCount = rejectedOrders?.totalOrders || 0;

  const handleOpenDialog = (type: "product" | "order") => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (formData: FormData) => {
    const newProduct: Product = {
      id: String(products.length + 1),
      ...formData,
      status: "pending",
    };
    setProducts([...products, newProduct]);
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  // In your OrderManagement component, add the delete mutation hook:
  const { mutate: deleteOrder, isPending: isDeleting } =
    useDeleteOrderMutation();

  // Add this delete handler function:
  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId, {
      onSuccess: () => {
        toast.success("Order deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete order");
      },
    });
  };

  // Loading and error states
  if (loadingTotal) return <CircularProgress />;
  if (errorTotal) return <Alert severity="error">Error loading orders</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Order Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            onClick={() => handleOpenDialog("order")}
          >
            Create New Order
          </Button>
          {/* <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog("product")}
          >
            Add New Product
          </Button> */}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <InventoryIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Products</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {products.length}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid> */}
            <Grid item xs={12} md={4}>
              {loadingTotal ? (
                <CircularProgress size={24} />
              ) : (
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <ShoppingCartIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Orders</Typography>
                    </Box>
                    <Typography variant="h4" color="success.main">
                      {totalCount.toString()}
                    </Typography>
                  </CardContent>
                </MotionCard>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {loadingPending ? (
                <CircularProgress size={24} />
              ) : (
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AssignmentIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">Pending Orders</Typography>
                    </Box>
                    <Typography variant="h4" color="warning.main">
                      {pendingCount.toString()}
                    </Typography>
                  </CardContent>
                </MotionCard>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ height: "100%" }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Close color="error" sx={{ mr: 1 }} />
                    <Typography variant="h6">Rejected Orders</Typography>
                  </Box>
                  <Typography variant="h4" color="error.main">
                    {rejectedCount.toString()}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Order Table */}
        {/* <Grid item xs={12}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>GIN</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Bill No</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Total Items</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          {order.ginDetails?.ginNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.ginDetails?.date
                            ? new Date(
                                order.ginDetails.date
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.ginDetails?.department || "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.ginDetails?.billNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.vendorDetails?.name || "N/A"}
                        </TableCell>
                        <TableCell>{order.items?.length || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status || "pending"}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionPaper>
        </Grid> */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>GIN</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Bill No</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Total Items</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          {order.ginDetails?.ginNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.ginDetails?.date
                            ? new Date(
                                order.ginDetails.date
                              ).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.ginDetails?.department || "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.ginDetails?.billNumber || "N/A"}
                        </TableCell>
                        <TableCell>
                          {order.vendorDetails?.name || "N/A"}
                        </TableCell>
                        <TableCell>{order.items?.length || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status || "pending"}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton color="primary" size="small">
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteOrder(order._id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <CircularProgress size={24} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogType === "order" ? "Create New Order" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <OrderForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;
