import express, { Router } from "express";
import {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
  getprofile,
} from "../Controllers/Auth.Controller.js";
import { verifyPatientToken } from "../Utils/Token.Middleware.js";

const router = express.Router();

router.route("/registerpatient").post(registerPatient);
router.route("/loginpatient").post(loginPatient);
router.route("/registerDoctor").post(registerDoctor);
router.route("/loginDoctor").post(loginDoctor);
router.route("/getprofile").get(verifyPatientToken,getprofile)

export default router;
