import express from "express";
import {
  getAllDoctors,
  getAllDomainDoctors,
  getCurrentDoctor,
} from "../Controllers/Doctor.Controller.js";
import { verifyDoctorToken } from "../Utils/Token.middleware.js";

const router = express.Router();

router.route("/getalldoctors").get(getAllDoctors);
router.route("/getallDomaindoctors").get(getAllDomainDoctors);
router.route("/getcurrentdoctor").get(verifyDoctorToken,getCurrentDoctor);

export default router;