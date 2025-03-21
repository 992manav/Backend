import express from "express";
import { setFirstReport, getReport, getReportbyUser, getpatients, setDetails } from "../Controllers/Report.Controller.js"; // Fixed function name
import { verifyPatientToken,verifyDoctorToken } from "../Utils/Token.Middleware.js";

const router = express.Router();

router.get("/getreportbyuser",verifyPatientToken, getReportbyUser);
router.get("/getpatients",verifyDoctorToken, getpatients)
router.post("/setdetails/:reportId",setDetails);
router.post("/setFirstreport", verifyPatientToken, setFirstReport);
router.get("/getreport/:reportId", verifyPatientToken, getReport);
router.get("/getreportdoctor/:reportId", verifyDoctorToken, getReport);

// (Optional) Define a GET route if needed
// router.get("/getalldoctors", getAllDoctors);

export default router;
