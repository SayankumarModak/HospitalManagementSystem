import express from "express";
import {
  getUserDetails,
  logoutAdmin,
  patientRegister,
  logoutPatient,
  addNewDoctor,
} from "../controller/userController.js";
import { login, addNewAdmin } from "../controller/userController.js";
import {
  isPatientAuthenticated,
  isAdminAuthenticated,
} from "../middlewares/auth.js";
import { getAllDoctors } from "../controller/userController.js";

const router = express.Router();
// 1
router.post("/patient/register", patientRegister);
// 2
router.post("/login", login);
// 3
router.post("/admin/addnew",  addNewAdmin);
// 4
router.get("/doctors", getAllDoctors);
// 5
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
// 6
router.get("/patient/me", isPatientAuthenticated, getUserDetails);

//  7
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
//  8
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
//  9

router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);

export default router;
