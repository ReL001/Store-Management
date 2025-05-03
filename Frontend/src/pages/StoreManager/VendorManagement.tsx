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
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import VendorForm from "./VendorForm";
import { useVendors } from "../../lib/react-query/hooks/useVendors";
import { 
  Vendor, 
  useDeleteVendorMutation 
} from "../../lib/react-query/vendorQueries";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const VendorManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Fetch vendors using our custom hook
  const { 
    data: vendorsData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useVendors(searchTerm);
  
  // Delete vendor mutation
  const deleteVendorMutation = useDeleteVendorMutation();

  const handleOpenDialog = (vendor?: Vendor) => {
    if (vendor) {
      setSelectedVendor(vendor);
    } else {
      setSelectedVendor(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVendor) {
      deleteVendorMutation.mutate(selectedVendor._id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          refetch();
        }
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setSelectedVendor(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Vendor Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Vendor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Search Box */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search vendors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BusinessIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Vendors</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {vendorsData?.totalVendors || 0}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EmailIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Active Orders</Typography>
                  </Box>
                  <Typography variant="h4" color="info.main">
                    5
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PhoneIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Recent Additions</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main">
                    {vendorsData?.vendors?.slice(0, 5).length || 0}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Vendors Table */}
        <Grid item xs={12}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Alert severity="error">
                Error loading vendors: {error instanceof Error ? error.message : "Unknown error"}
              </Alert>
            ) : vendorsData && vendorsData.vendors.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>GSTIN</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendorsData.vendors.map((vendor) => (
                      <TableRow key={vendor._id} hover>
                        <TableCell>{vendor.name}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>{vendor.phone}</TableCell>
                        <TableCell>{vendor.address}</TableCell>
                        <TableCell>{vendor.gstin || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenDialog(vendor)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteClick(vendor)} 
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  No vendors found. Add your first vendor.
                </Typography>
              </Box>
            )}
          </MotionPaper>
        </Grid>
      </Grid>

      {/* Create/Edit Vendor Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedVendor ? "Edit Vendor" : "Add New Vendor"}
        </DialogTitle>
        <DialogContent>
          <VendorForm 
            vendor={selectedVendor}
            onSubmitSuccess={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete vendor: {selectedVendor?.name}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ display: 'flex', px: 2, pb: 2, justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteVendorMutation.isPending}
          >
            {deleteVendorMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default VendorManagement;