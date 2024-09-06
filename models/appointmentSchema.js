import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
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
    minLength: [11, "phone exact 11 numbers"],
    maxLength: [11, "phone exact 11 numbers"],
  },
  nic: {
    type: String,
    required: true,
    minLength: [13, "nic exact 13 digits needed"],
    maxLength: [13, "nic exact 13 digits needed"],
  },
  dob: {
    type: String,
    required: true,
  },
  gender: {
    required: true,
    type: String,
    enum: ["Male", "Female"],
  },
  appointment_date: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
