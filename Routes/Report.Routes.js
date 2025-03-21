import express from "express";
import {
  setFirstReport,
  getReport,
  getReportbyUser,
  getreports,
  setDetails,
  sendDiagnosis,
  sendSuggestion,
  sendPrescription,
} from "../Controllers/Report.Controller.js"; // Fixed function name
import {
  verifyPatientToken,
  verifyDoctorToken,
} from "../Utils/Token.Middleware.js";

const router = express.Router();

router.get("/getreportbyuser", verifyPatientToken, getReportbyUser);
router.get("/getreports", verifyDoctorToken, getreports);
router.post("/setdetails/:reportId", setDetails);
router.post("/setFirstreport", verifyPatientToken, setFirstReport);
router.get("/getreport/:reportId", verifyPatientToken, getReport);
router.get("/getreportdoctor/:reportId", verifyDoctorToken, getReport);

router.post("/send-diagnosis", verifyDoctorToken, sendDiagnosis);
router.post("/send-suggestion", verifyDoctorToken, sendSuggestion);
router.post("/send-prescription", verifyDoctorToken, sendPrescription);

export default router;
