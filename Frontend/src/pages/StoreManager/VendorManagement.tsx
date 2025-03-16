import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useFormik, FormikConfig } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { vendorsAPI } from '../../services/api';

const MotionCard = motion(Card);

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  products: string[];
  rating: number;
  totalOrders: number;
  status: 'active' | 'inactive';
}

interface VendorFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  products: string[];
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  gstNumber: Yup.string(),
  products: Yup.array().of(Yup.string()),
});

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await vendorsAPI.getAll();
      setVendors(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      gstNumber: '',
      products: [] as string[],
    } as VendorFormValues,
    validationSchema,
    onSubmit: async (values: VendorFormValues) => {
      try {
        setLoading(true);
        if (selectedVendor) {
          await vendorsAPI.update(selectedVendor._id, values);
        } else {
          await vendorsAPI.create(values);
        }
        setOpenDialog(false);
        fetchVendors();
        formik.resetForm();
        setError(null);
      } catch (err) {
        setError('Failed to save vendor');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    formik.setValues({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      gstNumber: vendor.gstNumber || '',
      products: vendor.products,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await vendorsAPI.delete(id);
      fetchVendors();
      setError(null);
    } catch (err) {
      setError('Failed to delete vendor');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRating = async (id: string, rating: number) => {
    try {
      setLoading(true);
      await vendorsAPI.updateRating(id, rating);
      fetchVendors();
      setError(null);
    } catch (err) {
      setError('Failed to update rating');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      setLoading(true);
      await vendorsAPI.updateStatus(id, status);
      fetchVendors();
      setError(null);
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Vendor Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedVendor(null);
            formik.resetForm();
            setOpenDialog(true);
          }}
          disabled={loading}
        >
          Add Vendor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {vendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor._id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{vendor.name}</Typography>
                  <Box>
                    <IconButton
                      onClick={() => handleEdit(vendor)}
                      size="small"
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(vendor._id)}
                      size="small"
                      color="error"
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {vendor.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {vendor.phone}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {vendor.address}
                </Typography>
                {vendor.gstNumber && (
                  <Typography variant="body2" gutterBottom>
                    GST: {vendor.gstNumber}
                  </Typography>
                )}
                <Box mt={1}>
                  <Rating
                    value={vendor.rating}
                    onChange={(_, value) => value && handleUpdateRating(vendor._id, value)}
                    icon={<StarIcon fontSize="small" />}
                    disabled={loading}
                  />
                </Box>
                <Box mt={1}>
                  <Chip
                    label={vendor.status}
                    color={vendor.status === 'active' ? 'success' : 'error'}
                    size="small"
                    onClick={() =>
                      handleUpdateStatus(
                        vendor._id,
                        vendor.status === 'active' ? 'inactive' : 'active'
                      )
                    }
                    disabled={loading}
                  />
                </Box>
                <Box mt={1}>
                  {vendor.products.map((product, index) => (
                    <Chip
                      key={index}
                      label={product}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {selectedVendor ? 'Edit Vendor' : 'Add New Vendor'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="name"
              label="Vendor Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              name="phone"
              label="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              name="address"
              label="Address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              margin="normal"
              multiline
              rows={3}
              disabled={loading}
            />
            <TextField
              fullWidth
              name="gstNumber"
              label="GST Number"
              value={formik.values.gstNumber}
              onChange={formik.handleChange}
              error={formik.touched.gstNumber && Boolean(formik.errors.gstNumber)}
              helperText={formik.touched.gstNumber && formik.errors.gstNumber}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              name="products"
              label="Products (comma-separated)"
              value={formik.values.products.join(', ')}
              onChange={(e) => {
                const products = e.target.value.split(',').map((p) => p.trim());
                formik.setFieldValue('products', products);
              }}
              margin="normal"
              helperText="Enter products separated by commas"
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : selectedVendor ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default VendorManagement; 