import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

interface Request {
  id: string;
  department: string;
  requester: string;
  items: {
    name: string;
    quantity: number;
    description: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  totalAmount: number;
}

const mockRequests: Request[] = [
  {
    id: '1',
    department: 'Computer Science',
    requester: 'John Doe',
    items: [
      { name: 'Laptop', quantity: 5, description: 'For lab use' },
      { name: 'Printer', quantity: 2, description: 'For department office' },
    ],
    status: 'pending',
    date: '2024-03-20',
    totalAmount: 250000,
  },
  {
    id: '2',
    department: 'Electronics',
    requester: 'Jane Smith',
    items: [
      { name: 'Oscilloscope', quantity: 3, description: 'For practical sessions' },
    ],
    status: 'pending',
    date: '2024-03-19',
    totalAmount: 150000,
  },
];

const ApproveRequests: React.FC = () => {
  const handleApprove = (requestId: string) => {
    // TODO: Implement approve functionality
    console.log('Approve request:', requestId);
  };

  const handleReject = (requestId: string) => {
    // TODO: Implement reject functionality
    console.log('Reject request:', requestId);
  };

  const handleViewDetails = (requestId: string) => {
    // TODO: Implement view details functionality
    console.log('View details:', requestId);
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Approve Requests
      </Typography>
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Requester</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>₹{request.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status.toUpperCase()}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(request.id)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Approve">
                      <IconButton
                        size="small"
                        onClick={() => handleApprove(request.id)}
                        color="success"
                      >
                        <ApproveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton
                        size="small"
                        onClick={() => handleReject(request.id)}
                        color="error"
                      >
                        <RejectIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MotionPaper>
    </Box>
  );
};

export default ApproveRequests; 