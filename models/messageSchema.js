import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "first name atleast 3 characters"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "last name atleast 3 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "enter valid email"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [11, " exact 11 numbers"],
    maxLength: [11, " exact 11 numbers"],
  },
  message: {
    type: String,
    required: true,
    minLength: [10, " atleast 10 charaters"],
  },
});

export const Message = mongoose.model("Message", messageSchema);
