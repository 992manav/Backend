import express from "express";
import { getPatient, setMedicalRecord } from "../Controllers/Patient.Controller.js"
import { verifyPatientToken } from "../Utils/Token.Middleware.js";

const router = express.Router();
router.post("/setmedicalrecord", verifyPatientToken, setMedicalRecord);
router.post("/getpatient",getPatient);
export default router;
