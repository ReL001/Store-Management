import { Request, Response, NextFunction } from 'express';
import { Request as RequestModel } from '../models/request.model';
import { AppError } from '../middleware/error.middleware';
import { emailService } from '../services/email.service';
import { User } from '../models/user.model';

// Create a new request
export const createRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = await RequestModel.create({
      ...req.body,
      requester: req.user?._id,
    });

    // Send notification to store manager
    const storeManager = await User.findOne({ role: 'store_manager' });
    if (storeManager) {
      await emailService.sendNewRequestNotification(request, storeManager);
    }

    res.status(201).json({
      status: 'success',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Get all requests with filters
export const getRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;
    const query: any = {};

    // Add filters based on user role
    if (req.user?.role === 'store_manager') {
      // Store manager can see all requests
      if (status) query.status = status;
    } else if (req.user?.role === 'hod') {
      // HOD can only see requests from their department
      query.department = req.user.department;
      if (status) query.status = status;
    }

    const requests = await RequestModel.find(query)
      .populate('requester', 'name email')
      .populate('approvedBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// Get single request
export const getRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = await RequestModel.findById(req.params.id)
      .populate('requester', 'name email')
      .populate('approvedBy', 'name email');

    if (!request) {
      return next(new AppError('Request not found', 404));
    }

    // Check if user has access to this request
    if (
      req.user?.role === 'hod' &&
      request.department !== req.user.department
    ) {
      return next(new AppError('Not authorized to access this request', 403));
    }

    res.status(200).json({
      status: 'success',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// Update request
export const updateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = await RequestModel.findById(req.params.id);

    if (!request) {
      return next(new AppError('Request not found', 404));
    }

    // Only requester can update their request
    if (request.requester.toString() !== req.user?._id.toString()) {
      return next(new AppError('Not authorized to update this request', 403));
    }

    // Cannot update if request is already approved/rejected
    if (request.status !== 'pending') {
      return next(new AppError('Cannot update approved/rejected request', 400));
    }

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: updatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Delete request
export const deleteRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = await RequestModel.findById(req.params.id);

    if (!request) {
      return next(new AppError('Request not found', 404));
    }

    // Only requester can delete their request
    if (request.requester.toString() !== req.user?._id.toString()) {
      return next(new AppError('Not authorized to delete this request', 403));
    }

    // Cannot delete if request is already approved/rejected
    if (request.status !== 'pending') {
      return next(new AppError('Cannot delete approved/rejected request', 400));
    }

    await request.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Approve/Reject request
export const updateRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;
    const request = await RequestModel.findById(req.params.id);

    if (!request) {
      return next(new AppError('Request not found', 404));
    }

    // Only store manager can approve/reject requests
    if (req.user?.role !== 'store_manager') {
      return next(new AppError('Not authorized to approve/reject requests', 403));
    }

    // Cannot update if request is already approved/rejected
    if (request.status !== 'pending') {
      return next(new AppError('Request is already approved/rejected', 400));
    }

    request.status = status;
    request.approvedBy = req.user._id;
    await request.save();

    // Send notification to requester
    const requester = await User.findById(request.requester);
    if (requester) {
      await emailService.sendRequestStatusNotification(request, requester);
    }

    res.status(200).json({
      status: 'success',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}; 