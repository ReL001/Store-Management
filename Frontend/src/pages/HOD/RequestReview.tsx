import React, { useState } from "react";
// ... (keep all your existing imports)
import { useOrderActions } from "lib/react-query/hooks/useOrderActions"; // Add this import
import { Order } from "types/order";
import { useGetOrders } from "lib/react-query/hooks/useGetOrders";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
interface OrderItem {
  name: string;
  qty: number;
}

const RequestReview: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get orders data
  const { data, isLoading, isError } = useGetOrders();
  const orders = (data?.orders || []) as Order[];
  const totalCount: number = data?.totalOrders || 0;

  // Get order actions
  const {
    approveOrder,
    rejectOrder,
    requestChanges,
    quotationRequested,
    isLoading: isActionLoading,
  } = useOrderActions();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "changes_requested":
        return "warning";
      default:
        return "default";
    }
  };

  const handleAction = async (
    action: "approve" | "reject" | "request_changes" | "quotation_requested"
  ) => {
    if (!selectedOrder) return;

    try {
      if (action === "request_changes") {
        await requestChanges(selectedOrder._id, comment);
      } else if (action === "approve") {
        await approveOrder(selectedOrder._id);
      } else if (action == "quotation_requested") {
        await quotationRequested(selectedOrder._id);
      } else {
        await rejectOrder(selectedOrder._id);
      }
      setOpenDialog(false);
      setComment("");
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  // Loading and error states
  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Error loading orders</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Request Review
      </Typography>

      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            {/* ... (keep your existing TableHead) */}
            <TableHead>
              <TableRow>
                <TableCell>GIN</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                {/* <TableCell>Department</TableCell> */}
                {/* <TableCell>Bill No</TableCell> */}
                {/* <TableCell>Vendor</TableCell> */}
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
                    {/* ... (keep your existing table cells) */}
                    <TableCell>
                      {order.ginDetails?.ginNumber || "N/A"}
                    </TableCell>
                    <TableCell>
                      {order.ginDetails?.date
                        ? new Date(order.ginDetails.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} - Qty: {item.quantity}
                        </div>
                      ))}
                    </TableCell>

                    {/* <TableCell> */}
                    {/* {order.ginDetails?.department || "N/A"} */}
                    {/* </TableCell> */}
                    {/* <TableCell> */}
                    {/* {order.ginDetails?.billNumber || "N/A"} */}
                    {/* </TableCell> */}
                    {/* <TableCell>{order.vendorDetails?.name || "N/A"}</TableCell> */}
                    <TableCell>{`${order.totalPrice} Rs`}</TableCell>

                    <TableCell>
                      <Chip
                        label={order.status || "pending"}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {order.status === "pending" && (
                        <>
                          <Button
                            startIcon={<CheckIcon />}
                            color="success"
                            size="small"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDialog(true);
                            }}
                            sx={{ mx: 0.5 }}
                            disabled={isActionLoading}
                          >
                            Approve
                          </Button>
                          <Button
                            startIcon={<CloseIcon />}
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDialog(true);
                            }}
                            sx={{ mx: 0.5 }}
                            disabled={isActionLoading}
                          >
                            Reject
                          </Button>
                          <Button
                            startIcon={<EditIcon />}
                            color="warning"
                            size="small"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDialog(true);
                            }}
                            sx={{ mx: 0.5 }}
                            disabled={isActionLoading}
                          >
                            Changes
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedOrder?.status === "pending"
            ? "Review Request"
            : "Add Comments"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comments"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            color="success"
            onClick={() => handleAction("approve")}
            disabled={isActionLoading}
          >
            Approve
          </Button>
          <Button
            color="error"
            onClick={() => handleAction("reject")}
            disabled={isActionLoading}
          >
            Reject
          </Button>
          <Button
            color="warning"
            onClick={() => handleAction("request_changes")}
            disabled={isActionLoading}
          >
            Request Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestReview;
