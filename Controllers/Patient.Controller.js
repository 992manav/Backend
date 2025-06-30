import { Patient } from "../Models/Patient.Model.js";
import { Report } from "../Models/Report.Model.js";
import * as faceapi from "face-api.js";

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

async function getPatient(req, res) {
  try {
    const patient = await Patient.findOne({ name: req.body.name });
    console.log(patient);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function searchByFace(req, res) {
  try {
    const { faceDescriptor } = req.body;

    if (!faceDescriptor) {
      return res.status(400).json({ message: "Face descriptor is required" });
    }

    // Fetch patients with face descriptors
    const patients = await Patient.find({ faceDescriptor: { $exists: true } });

    if (!patients.length) {
      return res
        .status(404)
        .json({ message: "No patients with face descriptors found" });
    }

    // Create labeled descriptors
    const labeledDescriptors = patients.map((patient) => {
      return new faceapi.LabeledFaceDescriptors(patient._id.toString(), [
        new Float32Array(patient.faceDescriptor),
      ]);
    });

    // Initialize FaceMatcher
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    // Find the best match
    const bestMatch = faceMatcher.findBestMatch(
      new Float32Array(faceDescriptor)
    );

    if (bestMatch.label === "unknown") {
      return res.status(404).json({ message: "No matching patient found" });
    }

    // Retrieve matched patient details
    const matchedPatient = patients.find(
      (patient) => patient._id.toString() === bestMatch.label
    );

    res.json({
      ...matchedPatient._doc,
      matchConfidence: 1 - Math.min(bestMatch.distance, 1),
    });
  } catch (err) {
    console.error("Face search error:", err);
    res.status(500).json({ message: "Face search failed" });
  }
}

const getLabeledDescriptors = async (req, res) => {
  try {
    // Find patients with a stored face descriptor
    const patients = await Patient.find({ faceDescriptor: { $exists: true } });

    // Map patients to an object containing a label and the descriptor
    const labeledDescriptors = patients.map((patient) => ({
      label: patient.name, // or another unique identifier
      faceDescriptor: patient.faceDescriptor,
    }));

    res.json(labeledDescriptors);
  } catch (err) {
    console.error("Error fetching labeled descriptors:", err);
    res.status(500).json({ message: "Failed to fetch labeled descriptors" });
  }
};

// Export the function to be used in routes
export { setMedicalRecord, getPatient, getPatientById, searchByFace , getLabeledDescriptors};
