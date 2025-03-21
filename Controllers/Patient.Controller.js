import { Patient } from "../Models/Patient.Model.js";

// Set or update the medical history for a specific patient by ID
async function setMedicalRecord(req, res) {
  try {
    // Get the patient ID from the authenticated user (from req.user._id)
    const patientId = req.user._id;
    console.log(patientId);
    // Extract the medicalHistory from the request body
    const { medicalHistory } = req.body;
    console.log(medicalHistory);
    // Validate if medicalHistory is provided and is an array
    if (!medicalHistory) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid medical history.",
      });
    }

    // Find the patient by their ID
    const patient = await Patient.findById(patientId);

    // If patient is not found, return a 404 error
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }
    patient.medicalHistory = medicalHistory;
    //console.log(patient.medicalHistory);
    // Save the updated patient record
    await patient.save();

    // Return a successful response with the updated patient data
    res.status(200).json({
      success: true,
      message: "Medical history updated successfully.",
      patient,
    });
  } catch (error) {
    // Catch any errors and return an appropriate error message
    res.status(500).json({
      success: false,
      message: "Failed to update medical history.",
      error: error.message,
    });
  }
}

// Export the function to be used in routes
export { setMedicalRecord };
