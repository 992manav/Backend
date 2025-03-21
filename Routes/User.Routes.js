import express, { Router } from "express";
import {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
} from "../Controllers/Auth.Controller.js";

const router = express.Router();

router.route("/registerpatient").post(registerPatient);
router.route("/loginpatient").post(loginPatient);
router.route("/registerDoctor").post(registerDoctor);
router.route("/loginDoctor").post(loginDoctor);

export default router;
