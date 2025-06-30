import express from "express";
import {
  getPatientById,
  setMedicalRecord,
  getPatient,
  searchByFace,
  getLabeledDescriptors,
} from "../Controllers/Patient.Controller.js";
import { verifyPatientToken } from "../Utils/Token.Middleware.js";

const router = express.Router();
router.post("/search-by-face", searchByFace);

router.post("/setmedicalrecord", verifyPatientToken, setMedicalRecord);
router.get("/getpatient/:patientID", verifyPatientToken, getPatientById);
router.get("/labeled-descriptors", getLabeledDescriptors);
router.post("/getpatient", getPatient);
export default router;
