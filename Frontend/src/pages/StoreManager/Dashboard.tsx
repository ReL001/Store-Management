import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <MotionPaper
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
      color: 'white',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <IconButton sx={{ color: 'white' }}>{icon}</IconButton>
    </Box>
    <Typography variant="h4" component="div" sx={{ mb: 1 }}>
      {value}
    </Typography>
    {trend && (
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {trend}
      </Typography>
    )}
  </MotionPaper>
);

const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Store Manager Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Products"
            value="156"
            icon={<InventoryIcon />}
            color="#1976d2"
            trend="+12% from last month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending Requests"
            value="8"
            icon={<AssignmentIcon />}
            color="#f50057"
            trend="3 new this week"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Approved Requests"
            value="45"
            icon={<CheckCircleIcon />}
            color="#4caf50"
            trend="+5% from last month"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Budget"
            value="₹2.5L"
            icon={<TrendingUpIcon />}
            color="#ff9800"
            trend="+8% from last month"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Requests
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">Laptop Purchase Request</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Department: Computer Science
                    </Typography>
                  </Box>
                  <Box sx={{ width: '30%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionPaper
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              p: 3,
              height: 400,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { title: 'Add New Product', icon: <InventoryIcon /> },
                { title: 'Create Request', icon: <AssignmentIcon /> },
                { title: 'View Reports', icon: <TrendingUpIcon /> },
              ].map((action, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton sx={{ mr: 2, color: 'primary.main' }}>
                      {action.icon}
                    </IconButton>
                    <Typography variant="subtitle1">{action.title}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 