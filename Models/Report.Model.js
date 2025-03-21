import mongoose, { Schema } from "mongoose";

const ReportSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  diagnosis: {
    type: String,
  },
  symptoms: {
    type: String,
    required: true,
  },
  date_of_creation: {
    type: Date,
    required: true,
    default: Date.now,
  },
  medications: [
    {
      type: String,
    },
  ],
  suggestions: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["NotCompleted", "Completed"],
  },
  initialConsultation: {
    type: Boolean,
    default: false,
  },
});

export const Report = mongoose.model("Report", ReportSchema);
