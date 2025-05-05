import React from "react";
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
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useRecentOrders } from "../../lib/react-query/hooks/useRecentOrders";
import { format } from "date-fns";
import { useGetOrders } from "lib/react-query/hooks/useGetOrders";
import { formatDistanceToNow } from "date-fns";

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
  const {
    data: approvedOrders,
    isLoading: loadingApproved,
    isError: errorApproved,
  } = useGetOrders("approved");
  const {
    data: rejectedOrders,
    isLoading: loadingRejected,
    isError: errorRejected,
  } = useGetOrders("rejected");

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        HOD Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          {loadingPending ? (
            <CircularProgress size={24} />
          ) : errorPending ? (
            <div>Error loading pending requests</div>
          ) : (
            <StatCard
              title="Pending Reviews"
              value={pendingOrders?.totalOrders || 0}
              icon={<AssignmentIcon />}
              color="#f50057"
              trend={`${pendingOrders?.orders?.length || 0} new today`}
            />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loadingApproved ? (
            <CircularProgress size={24} />
          ) : errorApproved ? (
            <div>Error loading approved requests</div>
          ) : (
            <StatCard
              title="Approved Requests"
              value={approvedOrders?.totalOrders || 0}
              icon={<CheckCircleIcon />}
              color="#4caf50"
              trend={`${
                approvedOrders?.orders?.length || 0
              } approved this month`}
            />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {loadingRejected ? (
            <CircularProgress size={24} />
          ) : errorRejected ? (
            <div>Error loading rejected requests</div>
          ) : (
            <StatCard
              title="Rejected Requests"
              value={rejectedOrders?.totalOrders ?? 0}
              icon={<WarningIcon />}
              color="#ff9800"
              trend={
                rejectedOrders && rejectedOrders.orders.length > 0
                  ? `Last: ${formatDistanceToNow(
                      new Date(rejectedOrders.orders[0].createdAt)
                    )} ago`
                  : "No recent rejections"
              }
            />
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Department Budget"
            value="₹1.2L"
            icon={<TrendingUpIcon />}
            color="#1976d2"
            trend="75% utilized"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              p: 3,
              // height: 400,
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recent Requests to Review
            </Typography>
            <Box sx={{ mt: 2 }}>
              {isLoading ? (
                <Typography>Loading requests to review...</Typography>
              ) : isError ? (
                <Typography color="error">
                  Failed to load requests to review
                </Typography>
              ) : (
                <>
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
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
                            {order.items[0]?.name || "Request"}
                            {order.items.length > 1 &&
                              ` (+${order.items.length - 1} more)`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Requested by: {order.createdBy || "Unknown"}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography>No requests to review found.</Typography>
                  )}
                </>
              )}
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
              Department Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[
                { title: "Total Faculty", value: "25", icon: <GroupIcon /> },
                {
                  title: "Active Projects",
                  value: "8",
                  icon: <AssignmentIcon />,
                },
                {
                  title: "Budget Allocation",
                  value: "₹2.5L",
                  icon: <TrendingUpIcon />,
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton sx={{ mr: 2, color: "primary.main" }}>
                      {item.icon}
                    </IconButton>
                    <Box>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="h6" color="primary">
                        {item.value}
                      </Typography>
                    </Box>
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
