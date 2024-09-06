import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !role
  ) {
    return next(new ErrorHandler("please fill everything", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("user already registered", 400));
  }
  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  });
  // res.status(200).json({
  //   success: true,
  //   message: "user registered",
  // });
  generateToken(user, "User Registered", 200, res);
});

//     to login for users
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("please fill all details", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("password and confirmpassword donot match", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid user or password", 400));
  }
  const isPasswordmatched = await user.comparePassword(password);
  if (!isPasswordmatched) {
    return next(new ErrorHandler("invalid user or password", 400));
  }

  if (role !== user.role) {
    return next(new ErrorHandler("user with this role doesnot exist", 400));
  }
  // this is noted that this code will  be not in used as we are generating tokens
  // res.status(200).json({
  //   success: true,
  //   message: "user logged in successfully",
  // });
  generateToken(user, " user loggedin successfully", 200, res);
});

// to add new admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, gender, dob, nic } =
    req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !gender ||
    !dob ||
    !nic
  ) {
    return next(new ErrorHandler("please fill everything", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} with this email already registered`
      )
    );
  }
  const admin = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    gender,
    dob,
    nic,
    role: "Admin",
  });
  res.status(200).json({
    success: true,
    message: "new admin registered",
  });
});

// to get all doctors
export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

// function to get all details of any user
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// to logout the admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None",
    })
    .json({
      success: true,
      message: "Admin loggedout successfully",
    });
});
// to logout the patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None",
    })
    .json({
      success: true,
      message: "Patient loggedout successfully",
    });
});

// add new doctor
export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("doctor avatar requied", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (allowedFormats.includes(docAvatar.minetype)) {
    return next(new ErrorHandler("file format is not supported", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    // !role ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("please provide full details", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(`${isRegistered.role} is already registered`, 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(cloudinaryResponse.error || "unknown error");
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
    role: "Doctor",
    docAvatar: {
      publicId: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    doctor,
    message: "new doctor added successfully",
    cloudinaryResponse,
  });
});
