import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { AppError } from '../middleware/error.middleware';
import { emailService } from '../services/email.service';
import { User } from '../models/user.model';

// Create a new product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    // Send notification to HOD
    const hod = await User.findOne({ role: 'hod', department: product.department });
    if (hod) {
      await emailService.sendNewProductNotification(product, hod);
    }

    res.status(201).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products with filters
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, department } = req.query;
    const query: any = {};

    // Add filters based on user role
    if (req.user?.role === 'store_manager') {
      query.createdBy = req.user._id;
    } else if (req.user?.role === 'hod') {
      query.department = req.user.department;
    }

    // Add optional filters
    if (status) query.status = status;
    if (department) query.department = department;

    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if user has access to this product
    if (
      req.user?.role === 'store_manager' &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      return next(new AppError('Not authorized to access this product', 403));
    }

    if (
      req.user?.role === 'hod' &&
      product.department !== req.user.department
    ) {
      return next(new AppError('Not authorized to access this product', 403));
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Only store manager who created the product can update it
    if (product.createdBy.toString() !== req.user?._id.toString()) {
      return next(new AppError('Not authorized to update this product', 403));
    }

    // Cannot update if product is already approved/rejected
    if (product.status !== 'pending') {
      return next(new AppError('Cannot update approved/rejected product', 400));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Only store manager who created the product can delete it
    if (product.createdBy.toString() !== req.user?._id.toString()) {
      return next(new AppError('Not authorized to delete this product', 403));
    }

    // Cannot delete if product is already approved/rejected
    if (product.status !== 'pending') {
      return next(new AppError('Cannot delete approved/rejected product', 400));
    }

    await product.remove();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Approve/Reject product
export const updateProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Only HOD can approve/reject products
    if (req.user?.role !== 'hod') {
      return next(new AppError('Not authorized to approve/reject products', 403));
    }

    // HOD can only approve/reject products from their department
    if (product.department !== req.user.department) {
      return next(new AppError('Not authorized to approve/reject this product', 403));
    }

    // Cannot update if product is already approved/rejected
    if (product.status !== 'pending') {
      return next(new AppError('Product is already approved/rejected', 400));
    }

    product.status = status;
    product.approvedBy = req.user._id;
    await product.save();

    // Send notification to store manager
    const storeManager = await User.findById(product.createdBy);
    if (storeManager) {
      await emailService.sendProductStatusNotification(product, storeManager);
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}; 