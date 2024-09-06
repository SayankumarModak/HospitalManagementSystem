 import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler("admin not authenticated ", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  // this below part is authorization
  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(`${req.user.role} not authorized for this resource`, 403)
    );
  }
  next();
});

export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
      return next(new ErrorHandler("patient not authenticated ", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (req.user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorized for this resource`,
          403
        )
      );
    }
    next();
  }
);