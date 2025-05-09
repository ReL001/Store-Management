import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateUserProfile } from "../../lib/react-query/hooks/useProfile";

interface SecurityFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const updateMutation = useUpdateUserProfile();

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(8, "Password must be at least 8 characters")
      .test({
        name: "not-same-as-current",
        message: "New password must be different from current password",
        test: function(value: string | undefined): boolean {
          // Explicitly typed test function
          const { parent } = this as any;
          return parent.currentPassword !== value;
        }
      }),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values: SecurityFormValues) => {
      updateMutation.mutate({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      
      // Reset form after submission
      if (!updateMutation.isError) {
        formik.resetForm();
      }
    },
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Password Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Update your password to keep your account secure
      </Typography>

      {updateMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Password updated successfully
        </Alert>
      )}

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : "Failed to update password"}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="currentPassword"
              name="currentPassword"
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
              helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              disabled={updateMutation.isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              disabled={updateMutation.isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              disabled={updateMutation.isPending}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={updateMutation.isPending}
                sx={{ minWidth: 150 }}
              >
                {updateMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  "Update Password"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default SecuritySettings;