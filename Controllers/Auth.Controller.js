import bcrypt from "bcryptjs";
import { Patient } from "../Models/Patient.Model.js";
import jwt from "jsonwebtoken";
import { Doctor } from "../Models/Doctor.Model.js";

function createAccessToken(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
    },
    process.env.A_SECRET_TOKEN,
    {
      expiresIn: "5h",
    }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    {
      _id: user._id,
    },
    process.env.R_SECRET_TOKEN,
    {
      expiresIn: "2d",
    }
  );
}

const registerPatient = async (req, res) => {
  try {
    const {
      email,
      name,
      password,
      date_of_birth,
      phone_number,
      emergency_contact,
      profile_picture,
      blood_group,
      allergies,
      gender,
    } = req.body;

    if (
      [
        email,
        name,
        password,
        date_of_birth,
        phone_number,
        blood_group,
        gender,
      ].some((f) => f?.trim() === "")
    ) {
      return res.status(408).json({
        msg: "All fields are required",
      });
    }

    const existedUser = await Patient.findOne({
      $or: [{ email: email }],
    });

    if (existedUser) {
      return res.status(409).json({
        msg: "User with email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name: name,
      email: email,
      password: hashedPassword,
      date_of_birth: date_of_birth,
      phone_number: phone_number,
      emergency_contact: emergency_contact,
      profile_picture: profile_picture,
      blood_group: blood_group,
      allergies: allergies,
      gender: gender,
    });

    const createdPatient = await Patient.findById(patient._id);

    if (createdPatient) {
      return res.status(200).json({
        msg: "Registration Done",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(407).json({
      msg: "Cannot Create account",
    });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((f) => f?.trim() === "")) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const user = await Patient.findOne({ email });

    if (!user) {
      return res.status(401).json({
        msg: "User does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        msg: "Invalid Password",
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        msg: "Login Successful",
        AT: accessToken,
        RT: refreshToken,
      });
  } catch (error) {
    console.log(error);
    res.status(410).send("Login Unsuccessful");
  }
};

export const getprofile = async (req, res) => {
  //console.log(req.user)
  try {
      const patient = await Patient.findById(req.user);
      if (!patient) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      console.log()
      res.status(200).json(patient);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
  }
}

export const registerDoctor = async (req, res) => {
  const {
    hospitalId,
    name,
    gender,
    phone_number,
    email,
    profilePicture,
    licenseNumber,
    speciality,
    password,
  } = req.body;
  console.log("HIHIH", req.body);

  try {
    const existingDoctor = await Doctor.findOne({ licenseNumber });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }
    const loweCaseSpeciality = speciality.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      hospitalId,
      name,
      gender,
      phone_number,
      email,
      profilePicture,
      licenseNumber,
      speciality: loweCaseSpeciality,
      password: hashedPassword,
    });
    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { licenseNumber, password } = req.body;
    if ([licenseNumber, password].some((f) => f?.trim() === "")) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const doctor = await Doctor.findOne({ licenseNumber });
    console.log("first", password, doctor.password);

    if (!doctor) {
      return res.status(404).json({
        msg: "Doctor not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, doctor.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        msg: "Invalid credentials",
      });
    }

    const accessToken = createAccessToken(doctor);
    const refreshToken = createRefreshToken(doctor);

    doctor.refreshToken = refreshToken;
    await doctor.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        msg: "Login Successful",
        AT: accessToken,
        RT: refreshToken,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export { registerPatient, loginPatient };
