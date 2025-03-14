import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { Request } from '../../types';

const RequestReview: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      productName: 'Laptop',
      description: 'High-performance laptop for computer lab',
      quantity: 10,
      unit: 'pieces',
      estimatedCost: 50000,
      status: 'pending',
      storeManager: 'John Doe',
      date: '2024-03-15',
    },
    // Add more sample requests as needed
  ]);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState('');

  const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
    setRequests(requests.map(request =>
      request.id === requestId
        ? { ...request, status: newStatus, comments: comment }
        : request
    ));
    setOpenDialog(false);
    setComment('');
  };

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'changes_requested':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Request Review
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Store Manager</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.date}</TableCell>
                <TableCell>{request.productName}</TableCell>
                <TableCell>{request.description}</TableCell>
                <TableCell>{request.quantity} {request.unit}</TableCell>
                <TableCell>₹{request.estimatedCost}</TableCell>
                <TableCell>{request.storeManager}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <>
                      <Button
                        startIcon={<CheckIcon />}
                        color="success"
                        size="small"
                        onClick={() => {
                          setSelectedRequest(request);
                          setOpenDialog(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        startIcon={<CloseIcon />}
                        color="error"
                        size="small"
                        onClick={() => {
                          setSelectedRequest(request);
                          setOpenDialog(true);
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        startIcon={<EditIcon />}
                        color="warning"
                        size="small"
                        onClick={() => {
                          setSelectedRequest(request);
                          setOpenDialog(true);
                        }}
                      >
                        Request Changes
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedRequest?.status === 'pending' ? 'Review Request' : 'Add Comments'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comments"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {selectedRequest && (
            <>
              <Button
                color="success"
                onClick={() => handleStatusChange(selectedRequest.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                color="error"
                onClick={() => handleStatusChange(selectedRequest.id, 'rejected')}
              >
                Reject
              </Button>
              <Button
                color="warning"
                onClick={() => handleStatusChange(selectedRequest.id, 'changes_requested')}
              >
                Request Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestReview; 