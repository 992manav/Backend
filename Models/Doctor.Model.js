import mongoose, { Schema } from "mongoose";

const DoctorSchema = new Schema({
  hospitalId: {
    type: String,
    //required:true
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    //required:tru
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  patients: [
    {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
});

export const Doctor = mongoose.model("Doctor", DoctorSchema);
