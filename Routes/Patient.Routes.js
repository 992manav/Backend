import express from "express";
import { setMedicalRecord } from "../Controllers/Patient.Controller.js"
import { verifyPatientToken } from "../Utils/Token.Middleware.js";

const router = express.Router();
router.post("/setmedicalrecord", verifyPatientToken, setMedicalRecord);
export default router;
