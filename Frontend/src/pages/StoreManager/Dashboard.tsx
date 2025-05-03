import React, { useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRecentOrders } from "../../lib/react-query/hooks/useRecentOrders";
import { format } from "date-fns";
import { useGetOrders } from "../../lib/react-query/hooks/useGetOrders";

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
      display: "flex",
      flexDirection: "column",
      height: 140,
      background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
      color: "white",
      borderRadius: 2,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Typography variant="h6" component="div">
        {title}
      </Typography>
      <IconButton sx={{ color: "white" }}>{icon}</IconButton>
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
  const { data: orders, isLoading, isError } = useRecentOrders();
  const {
    data: pendingOrders,
    isLoading: loadingPending,
    isError: errorPending,
  } = useGetOrders("pending");
  // console.log("Fetched Pending Orders:", pendingOrders);
  const {
    data: approvedOrders,
    isLoading: loadingApproved,
    isError: errorApproved,
  } = useGetOrders("approved");

  const pendingCount = pendingOrders?.totalOrders || 0;
  const approvedCount = approvedOrders?.totalOrders || 0;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
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
          {loadingPending ? (
            <CircularProgress size={24} />
          ) : (
            <StatCard
              title="Pending Requests"
              value={pendingCount.toString()}
              icon={<AssignmentIcon />}
              color="#f50057"
              trend={`${pendingCount} pending`}
            />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loadingApproved ? (
            <CircularProgress size={24} />
          ) : (
            <StatCard
              title="Approved Requests"
              value={approvedCount.toString()}
              icon={<CheckCircleIcon />}
              color="#4caf50"
              trend={`${approvedCount} approved`}
            />
          )}
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
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Requests
            </Typography>
            <Box sx={{ mt: 2 }}>
              {isLoading && (
                <Typography>
                  Loading recent requests...
                  <CircularProgress size={24} />
                </Typography>
              )}
              {isError && (
                <Typography color="error">
                  Failed to load recent requests
                </Typography>
              )}
              {!isLoading && orders?.length === 0 && (
                <Typography>No recent orders found.</Typography>
              )}

              {orders?.map((order) => (
                <Box
                  key={order._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "background.default",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">
                      {order.items[0]?.name || "Order Request"}
                      {order.items.length > 1 &&
                        ` (+${order.items.length - 1} more)`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {order.status}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created:{" "}
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "30%" }}>
                    <LinearProgress
                      variant="determinate"
                      value={
                        order.status === "approved"
                          ? 100
                          : order.status === "pending"
                          ? 50
                          : 10
                      }
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "primary.main",
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
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { title: "Add New Product", icon: <InventoryIcon /> },
                { title: "Create Request", icon: <AssignmentIcon /> },
                { title: "View Reports", icon: <TrendingUpIcon /> },
              ].map((action, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton sx={{ mr: 2, color: "primary.main" }}>
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
