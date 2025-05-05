import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { useLogin } from "../../lib/react-query/hooks/useLogin"; // <-- make sure this path is correct
import { User } from "types";

const MotionPaper = motion(Paper);

interface LoginFormValues {
  email: string;
  password: string;
}

type LoginResponse = {
  user: User;
  accessToken: string;
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  // Destructure the mutate function and the state from the useLoginMutation hook
  const {
    mutate,
    isPending, // Instead of isLoading
    isSuccess,
    isError,
    error: mutationError,
  } = useLogin(); // <-- Connect backend here

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values: LoginFormValues) => {
      setError(null);
      mutate(values, {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (err: any) => {
          setError(err.message || "Login failed. Please try again.");
        },
      });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ p: 4, width: "100%" }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            College Store Management
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
              autoComplete="email"
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isPending} // Disable button when login is pending
            >
              {isPending ? "Logging in..." : "Sign In"}
            </Button>
          </form>
        </MotionPaper>
      </Box>
    </Container>
  );
};

export default Login;
