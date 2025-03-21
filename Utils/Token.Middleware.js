import { Patient } from "../Models/Patient.Model.js";
import { Doctor } from "../Models/Doctor.Model.js";
import jwt from "jsonwebtoken"

export async function verifyPatientToken(req, res, next) {
  const currAccessToken = req.cookies?.accessToken;

  if (!currAccessToken) {
    return res.status(400).json({
      msg: "User is not logged in",
    });
  }

  try {
    const dataFromToken = jwt.verify(currAccessToken, process.env.A_SECRET_TOKEN);
    console.log("Decoded Token:", dataFromToken);

    // First, check if a Patient (User) is logged in
    let userFromToken = await Patient.findById(dataFromToken?._id).select(
      "-password -refreshToken"
    );

    // If no patient found, check if it's a Doctor
    if (!userFromToken) {
      userFromToken = await Doctor.findById(dataFromToken?._id).select(
        "-password -refreshToken"
      );
    }

    // If neither a user nor a doctor is found, return error
    if (!userFromToken) {
      return res.status(400).json({
        msg: "Access token is invalid or user/doctor not found",
      });
    }

    // Set the authenticated user in request
    req.user = userFromToken;
    console.log("Authenticated User:", req.user);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "Access token has expired",
      });
    }

    return res.status(401).json({
      msg: "Invalid token",
    });
  }
}

export async function verifyDoctorToken(req,res,next){
    
    const currAccessToken = req.cookies?.accessToken;

  if (!currAccessToken) {
    return res.status(400).json({
      msg: "User is not logged in",
    });
  }

  try {
    const dataFromToken = jwt.verify(
      currAccessToken,
      process.env.A_SECRET_TOKEN
    );

    const userFromToken = await Doctor.findById(dataFromToken?._id).select(
      "-password -refreshToken"
    );

    if (!userFromToken) {
      return res.status(400).json({
        msg: "Access token is fake",
      });
    }

    req.user = userFromToken;
    console.log("User from token", req.user);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "Access token has expired",
      });
    }

    return res.status(401).json({
      msg: "Invalid token",
    });
  }
}