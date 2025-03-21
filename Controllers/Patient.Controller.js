import { Patient } from "../Models/Patient.Model.js";
import { Report } from "../Models/Report.Model.js";

// ✅ Set or update the medical history for a specific patient by ID
const setMedicalRecord = async (req, res) => {
  try {
    // Get the patient ID from the authenticated user (Patient)
    const patientId = req.user._id;
    console.log("Patient ID:", patientId);

    // Extract the medicalHistory from the request body
    const { medicalHistory } = req.body;
    console.log("Medical History:", medicalHistory);

    // Validate input
    if (!medicalHistory) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid medical history.",
      });
    }

    // ✅ Find the patient by their ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // ✅ Update medical history and save
    patient.medicalHistory = medicalHistory;
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Medical history updated successfully.",
      patient,
    });
  } catch (error) {
    console.error("Error updating medical history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update medical history.",
      error: error.message,
    });
  }
};

// ✅ Get Patient Details & Reports by Patient ID for a Doctor
const getPatientById = async (req, res) => {
  try {
    const { patientID } = req.params;
    const doctorID = req.user._id; // ✅ Get the doctor ID from authentication
    console.log("Doctor ID:", doctorID);
    console.log("Patient ID:", patientID);

    // ✅ Find the patient by ID
    const patient = await Patient.findById(patientID);
    console.log("Patient:", patient);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    console.log("hiiiiii");

    // ✅ Find the latest report for this patient by the current doctor
    const report = await Report.findOne({
      patient: patientID,
      doctor: doctorID,
    }); // Get the latest report

    console.log("\nReport:", report);
    res.status(200).json({
      success: true,
      patient,
      report:
        report || "No report found for this patient with the given doctor.",
    });
  } catch (error) {
    console.error("Error fetching patient details and reports:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { setMedicalRecord, getPatientById };
