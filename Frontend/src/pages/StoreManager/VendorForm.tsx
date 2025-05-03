import React from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { 
  Vendor, 
  useCreateVendorMutation,
  useUpdateVendorMutation
} from "../../lib/react-query/vendorQueries";

interface VendorFormProps {
  vendor: Vendor | null;
  onSubmitSuccess: () => void;
}

// Define the shape of form values
interface VendorFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  additionalDetails?: string;
}

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Vendor name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  gstin: Yup.string(),
  additionalDetails: Yup.string(),
});

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSubmitSuccess }) => {
  const createVendorMutation = useCreateVendorMutation();
  const updateVendorMutation = useUpdateVendorMutation();

  const isEditMode = !!vendor;

  const formik = useFormik({
    initialValues: {
      name: vendor?.name || "",
      email: vendor?.email || "",
      phone: vendor?.phone || "",
      address: vendor?.address || "",
      gstin: vendor?.gstin || "",
      additionalDetails: vendor?.additionalDetails || "",
    },
    validationSchema,
    onSubmit: (values: VendorFormValues) => {
      if (isEditMode && vendor) {
        // Update existing vendor
        updateVendorMutation.mutate({
          id: vendor._id,
          vendorData: values
        }, {
          onSuccess: () => {
            onSubmitSuccess();
          }
        });
      } else {
        // Create new vendor
        createVendorMutation.mutate(values, {
          onSuccess: () => {
            onSubmitSuccess();
          }
        });
      }
    },
  });
  
  const isSubmitting = createVendorMutation.isPending || updateVendorMutation.isPending;
  const error = createVendorMutation.error || updateVendorMutation.error;

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : "An error occurred"}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Basic Information
          </Typography>
        </Grid>
        
        {/* Vendor Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Vendor Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            disabled={isSubmitting}
          />
        </Grid>
        
        {/* Email */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isSubmitting}
          />
        </Grid>
        
        {/* Phone */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            disabled={isSubmitting}
          />
        </Grid>
        
        {/* GSTIN */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="gstin"
            name="gstin"
            label="GSTIN (Optional)"
            value={formik.values.gstin}
            onChange={formik.handleChange}
            error={formik.touched.gstin && Boolean(formik.errors.gstin)}
            helperText={formik.touched.gstin && formik.errors.gstin}
            disabled={isSubmitting}
          />
        </Grid>
        
        {/* Address */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Address"
            multiline
            rows={2}
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            disabled={isSubmitting}
          />
        </Grid>
        
        {/* Additional Details */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="additionalDetails"
            name="additionalDetails"
            label="Additional Details (Optional)"
            multiline
            rows={3}
            value={formik.values.additionalDetails}
            onChange={formik.handleChange}
            error={formik.touched.additionalDetails && Boolean(formik.errors.additionalDetails)}
            helperText={formik.touched.additionalDetails && formik.errors.additionalDetails}
            disabled={isSubmitting}
          />
        </Grid>
        
        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update Vendor"
              ) : (
                "Add Vendor"
              )}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorForm;