import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  emergency_contact: {
    type: String,
  },
  profile_picture: {
    type: String,
  },
  address: {
    type: String,
  },
  blood_group: {
    type: String,
    required: true,
  },
  allergies: [
    {
      type: String,
    },
  ],
  medicalHistory: {
    type: String,
  },
  faceDescriptor: {
    type: [Number],
    default: [],
  },
});

export const Patient = mongoose.model("Patient", PatientSchema);
