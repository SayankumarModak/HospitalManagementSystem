import express from "express";
import { postAppointment } from "../controller/appointmentController.js";
import {
  isPatientAuthenticated,
  isAdminAuthenticated,
} from "../middlewares/auth.js";
import {
  getAllAppointments,
  updateAppointments,
  deleteAppointments,
  sendMail
} from "../controller/appointmentController.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointments);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointments);
router.post('/sendmail', isAdminAuthenticated, sendMail)

export default router;
