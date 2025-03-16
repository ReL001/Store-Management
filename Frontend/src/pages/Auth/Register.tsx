import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  alpha,
  Link,
  Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { authAPI } from '../../services/api';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'store_manager' | 'hod';
  department?: string;
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['store_manager', 'hod'], 'Invalid role')
    .required('Role is required'),
  department: Yup.string()
    .when('role', {
      is: 'hod',
      then: Yup.string().required('Department is required for HOD'),
    }),
});

const departments = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Chemical',
];

const Register: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'store_manager',
      department: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        setLoading(true);
        
        const { confirmPassword, ...registerData } = values;
        await authAPI.register(registerData);
        
        // Show success message and redirect to login
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.' 
          }
        });
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message || 
          'An error occurred during registration. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <MotionPaper
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            elevation={24}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                mb: 3,
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: 48,
                  color: theme.palette.secondary.main,
                  mb: 2,
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 2,
                }}
              >
                Register as HOD or Store Manager
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  animation: 'shake 0.5s',
                  '@keyframes shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
                disabled={loading}
                InputProps={{
                  startAdornment: <BadgeIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
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
                disabled={loading}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
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
                disabled={loading}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                margin="normal"
                disabled={loading}
                InputProps={{
                  startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <FormControl
                fullWidth
                margin="normal"
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  label="Role"
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="store_manager">Store Manager</MenuItem>
                  <MenuItem value="hod">Head of Department (HOD)</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
                    {formik.errors.role}
                  </Typography>
                )}
              </FormControl>

              {formik.values.role === 'hod' && (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={formik.touched.department && Boolean(formik.errors.department)}
                >
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    label="Department"
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.department && formik.errors.department && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
                      {formik.errors.department}
                    </Typography>
                  )}
                </FormControl>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: theme.shadows[8],
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                    boxShadow: theme.shadows[12],
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Account'
                )}
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: theme.palette.secondary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in to your account
                </Link>
              </Box>
            </form>
          </MotionPaper>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Register; 