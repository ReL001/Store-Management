import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Product } from '../../types';

const validationSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  description: Yup.string().required('Description is required'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  unit: Yup.string().required('Unit is required'),
  estimatedCost: Yup.number().required('Estimated cost is required').min(0, 'Cost must be non-negative'),
});

const ProductManagement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      quantity: 1,
      unit: '',
      estimatedCost: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editingProduct) {
        // Update existing product
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...values, id: p.id } : p
        ));
      } else {
        // Add new product
        setProducts([...products, { ...values, id: Date.now().toString() }]);
      }
      handleClose();
    },
  });

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      formik.setValues(product);
    } else {
      setEditingProduct(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    formik.resetForm();
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Product Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Estimated Cost</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unit}</TableCell>
                <TableCell>₹{product.estimatedCost}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Product Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                  error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                  helperText={formik.touched.quantity && formik.errors.quantity}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="unit"
                  label="Unit"
                  value={formik.values.unit}
                  onChange={formik.handleChange}
                  error={formik.touched.unit && Boolean(formik.errors.unit)}
                  helperText={formik.touched.unit && formik.errors.unit}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="estimatedCost"
                  label="Estimated Cost"
                  type="number"
                  value={formik.values.estimatedCost}
                  onChange={formik.handleChange}
                  error={formik.touched.estimatedCost && Boolean(formik.errors.estimatedCost)}
                  helperText={formik.touched.estimatedCost && formik.errors.estimatedCost}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductManagement; 