import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

import { Message } from "../models/messageSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, message, phone, email } = req.body;
  if (!firstName || !lastName || !message || !phone || !email) {
    // return res.status(400).json({
    //   success: false,
    //   message: "please fill everything",
    // });
    // changes due to errormiddleware
    return next(new ErrorHandler("please fill everything", 400));
  }
  await Message.create({ firstName, lastName, message, phone, email });
  res.status(200).json({
    success: true,
    message: "message send successfully",
  });
});

// to get all messages (this messages only can see)
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});
