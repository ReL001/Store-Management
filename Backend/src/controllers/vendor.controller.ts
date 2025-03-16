import { Request, Response, NextFunction } from 'express';
import { Vendor } from '../models/vendor.model';
import { AppError } from '../middleware/error.middleware';

// Get all vendors
export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({
      status: 'success',
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

// Get single vendor
export const getVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return next(new AppError('Vendor not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Create vendor
export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({
      status: 'success',
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Update vendor
export const updateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return next(new AppError('Vendor not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete vendor
export const deleteVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return next(new AppError('Vendor not found', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Update vendor status
export const updateVendorStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return next(new AppError('Vendor not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// Update vendor rating
export const updateVendorRating = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rating } = req.body;

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return next(new AppError('Vendor not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
}; 