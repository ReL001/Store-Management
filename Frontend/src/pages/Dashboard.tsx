import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { alpha } from '@mui/system';

const MotionCard = motion(Card);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <MotionCard
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      sx={{
        height: '100%',
        background: `linear-gradient(45deg, ${color} 0%, ${theme.palette.background.paper} 100%)`,
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-4px)',
          transition: 'all 0.3s',
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton
            sx={{
              backgroundColor: alpha(color, 0.1),
              '&:hover': {
                backgroundColor: alpha(color, 0.2),
              },
            }}
          >
            {icon}
          </IconButton>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 2,
            color: theme.palette.text.secondary,
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </MotionCard>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Products',
      value: '248',
      icon: <InventoryIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Pending Requests',
      value: '12',
      icon: <ShoppingCartIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Active Vendors',
      value: '18',
      icon: <BusinessIcon />,
      color: theme.palette.success.main,
    },
    {
      title: 'Completed Orders',
      value: '156',
      icon: <AssignmentIcon />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          mb: 4,
        }}
      >
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              height: '400px',
              background: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Add activity chart or list here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '400px',
              background: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            {/* Add quick action buttons here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 