import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Divider,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useVendors } from '../../lib/react-query/hooks/useVendors';
import { Vendor } from '../../lib/react-query/vendorQueries';
import { useCreateOrder } from '../../lib/react-query/hooks/useCreateOrder';

const MotionPaper = motion(Paper);

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface FormData {
  gin: string;
  date: string;
  department: string;
  billNo: string;
  vendor: Vendor; // Changed to store Vendor object
  items: Item[];
}

interface OrderFormProps {
  onSubmit: (data: FormData) => void;
}

// Define form values interface to avoid circular reference
interface OrderFormValues {
  gin: string;
  date: string;
  department: string;
  billNo: string;
  vendor: Vendor | null;
}

const validationSchema = Yup.object({
  gin: Yup.string().required('GIN is required'),
  date: Yup.date().required('Date is required'),
  department: Yup.string().required('Department is required'),
  billNo: Yup.string().required('Bill number is required'),
  vendor: Yup.object().required('Vendor is required'),
});

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "Other",
];

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "", description: "", quantity: 0, unitPrice: 0, total: 0 },
  ]);
  
  // Fetch vendors from the database
  const { data: vendorsData, isLoading: loadingVendors } = useVendors();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const createOrderMutation = useCreateOrder();

  const formik = useFormik({
    initialValues: {
      gin: '',
      date: new Date().toISOString().split('T')[0],
      department: '',
      billNo: '',
      vendor: null as Vendor | null,
    },
    validationSchema,
    onSubmit: (values: OrderFormValues) => {
      if (!selectedVendor) return;
      
      // Prepare the payload
      const orderPayload = {
        ginDetails: {
          ginNumber: values.gin,
          date: values.date,
          department: values.department,
          billNumber: values.billNo,
        },
        vendorDetails: {
          name: selectedVendor.name,
          contactNumber: selectedVendor.phone,
          gstin: selectedVendor.gstin || '',
          address: selectedVendor.address,
        },
        items: items.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };
      
      // Submit using the mutation instead of just passing to parent
      createOrderMutation.mutate(orderPayload, {
        onSuccess: () => {
          // Pass the form data to parent component's onSubmit for any UI updates
          onSubmit({
            ...values,
            vendor: selectedVendor,
            items: items
          } as FormData);
        },
      });
    },
  });

  const addItem = () => {
    setItems([
      ...items,
      {
        id: String(items.length + 1),
        name: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof Item,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // When a vendor is selected in the autocomplete, update the formik value
  const handleVendorChange = (vendor: Vendor | null) => {
    setSelectedVendor(vendor);
    formik.setFieldValue('vendor', vendor);
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ p: 4, maxWidth: 1200, mx: "auto", mt: 4 }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        New Product Entry
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* GIN Details Section */}
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              GIN Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="GIN Number"
              name="gin"
              value={formik.values.gin}
              onChange={formik.handleChange}
              error={formik.touched.gin && Boolean(formik.errors.gin)}
              helperText={formik.touched.gin && formik.errors.gin}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Department"
              name="department"
              value={formik.values.department}
              onChange={formik.handleChange}
              error={
                formik.touched.department && Boolean(formik.errors.department)
              }
              helperText={formik.touched.department && formik.errors.department}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Bill Number"
              name="billNo"
              value={formik.values.billNo}
              onChange={formik.handleChange}
              error={formik.touched.billNo && Boolean(formik.errors.billNo)}
              helperText={formik.touched.billNo && formik.errors.billNo}
            />
          </Grid>

          {/* Vendor Details Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Vendor Details
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            {loadingVendors ? (
              <CircularProgress size={24} />
            ) : (
              <Autocomplete
                id="vendor-select"
                options={vendorsData?.vendors || []}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                value={selectedVendor}
                onChange={(_, newValue) => handleVendorChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Vendor"
                    error={formik.touched.vendor && Boolean(formik.errors.vendor)}
                    helperText={formik.touched.vendor && formik.errors.vendor}
                  />
                )}
              />
            )}
          </Grid>
          
          {selectedVendor && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={selectedVendor.phone}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="GSTIN"
                  value={selectedVendor.gstin || 'N/A'}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={selectedVendor.address}
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </>
          )}

          {/* Items Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: "primary.main" }}>
                Items
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addItem}
                variant="outlined"
                color="primary"
              >
                Add Item
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              Number(e.target.value)
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography>₹{item.total.toFixed(2)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ minWidth: 200 }}
                disabled={!formik.isValid || items.some(item => !item.name || item.quantity <= 0)}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </MotionPaper>
  );
};

export default OrderForm;