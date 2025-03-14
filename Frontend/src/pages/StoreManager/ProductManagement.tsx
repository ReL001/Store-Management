import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductForm from './ProductForm';

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

interface Vendor {
  name: string;
  address: string;
  contact: string;
  gstin: string;
}

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Product {
  id: string;
  gin: string;
  date: string;
  department: string;
  billNo: string;
  vendor: Vendor;
  items: Item[];
  status: 'pending' | 'approved' | 'rejected';
}

interface FormData {
  gin: string;
  date: string;
  department: string;
  billNo: string;
  vendor: Vendor;
  items: Item[];
}

const ProductManagement: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogType, setDialogType] = useState<'product' | 'order'>('product');

  const handleOpenDialog = (type: 'product' | 'order') => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (formData: FormData) => {
    const newProduct: Product = {
      id: String(products.length + 1),
      ...formData,
      status: 'pending',
    };
    setProducts([...products, newProduct]);
    handleCloseDialog();
  };

  const getStatusColor = (status: string) => {
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Product Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            onClick={() => handleOpenDialog('order')}
          >
            Create New Order
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('product')}
          >
            Add New Product
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InventoryIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Products</Typography>
                  </Box>
                  <Typography variant="h4" color="primary">
                    {products.length}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssignmentIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Pending Orders</Typography>
                  </Box>
                  <Typography variant="h4" color="warning.main">
                    {products.filter(p => p.status === 'pending').length}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ShoppingCartIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Orders</Typography>
                  </Box>
                  <Typography variant="h4" color="success.main">
                    {products.length}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Products Table */}
        <Grid item xs={12}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>GIN</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Bill No</TableCell>
                    <TableCell>Vendor</TableCell>
                    <TableCell>Total Items</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.gin}</TableCell>
                      <TableCell>{product.date}</TableCell>
                      <TableCell>{product.department}</TableCell>
                      <TableCell>{product.billNo}</TableCell>
                      <TableCell>{product.vendor.name}</TableCell>
                      <TableCell>{product.items.length}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.status}
                          color={getStatusColor(product.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MotionPaper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'order' ? 'Create New Order' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 