import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import { useGetUserProfile, useUpdateUserProfile } from "../../lib/react-query/hooks/useProfile";

// Define department options directly in the component since the import was causing issues
const departmentEnum = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Biotech",
];

// Define interface for form values
interface ProfileFormValues {
  fullName: string;
  email: string;
  department: string;
  role: string;
}

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { data: profileData, isLoading, isError, error } = useGetUserProfile();
  const updateMutation = useUpdateUserProfile();

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    department: Yup.string().when("role", {
      is: "hod",
      then: (schema: any) => schema.required("Department is required for HOD users"),
      otherwise: (schema: any) => schema.optional(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      department: user?.department || "",
      role: user?.role || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: ProfileFormValues) => {
      const updateData: Record<string, string> = {};
      
      // Only send fields that were changed
      if (values.fullName !== user?.fullName) {
        updateData.fullName = values.fullName;
      }
      
      if (values.email !== user?.email) {
        updateData.email = values.email;
      }
      
      if (user?.role === "hod" && values.department !== user.department) {
        updateData.department = values.department;
      }
      
      // Submit changes if there are any
      if (Object.keys(updateData).length > 0) {
        updateMutation.mutate(updateData);
      }
    },
  });

  useEffect(() => {
    // When profile data is loaded, update the form with most current data
    if (profileData) {
      formik.setValues({
        fullName: profileData.fullName || "",
        email: profileData.email || "",
        department: profileData.department || "",
        role: profileData.role || "",
      });
    }
  }, [profileData]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        Error loading profile: {error instanceof Error ? error.message : "Unknown error"}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your personal details and information
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              alt={user?.fullName || "User"}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            >
              {user?.fullName?.charAt(0) || "U"}
            </Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Profile photo
            </Typography>
            {/* Could add photo upload functionality here */}
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                  helperText={formik.touched.fullName && formik.errors.fullName}
                  disabled={updateMutation.isPending}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  disabled={updateMutation.isPending}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="role"
                  name="role"
                  label="Role"
                  value={formik.values.role === "manager" ? "Store Manager" : "Head of Department"}
                  disabled={true}
                />
              </Grid>

              {user?.role === "hod" && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="department"
                    name="department"
                    label="Department"
                    select
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    helperText={formik.touched.department && formik.errors.department}
                    disabled={updateMutation.isPending}
                  >
                    {departmentEnum.map((dept: string) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                type="submit"
                disabled={!formik.dirty || updateMutation.isPending}
                sx={{ minWidth: 150 }}
              >
                {updateMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ProfileSettings;