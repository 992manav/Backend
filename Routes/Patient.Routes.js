import express from "express";
import {
  getPatientById,
  setMedicalRecord,
  getPatient,
} from "../Controllers/Patient.Controller.js";
import { verifyPatientToken } from "../Utils/Token.Middleware.js";

const router = express.Router();
router.post("/setmedicalrecord", verifyPatientToken, setMedicalRecord);
router.get("/getpatient/:patientID", verifyPatientToken, getPatientById);
router.post("/getpatient", getPatient);
export default router;
