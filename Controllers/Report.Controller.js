import { Report } from "../Models/Report.Model.js";
import { Doctor } from "../Models/Doctor.Model.js";
import { Patient } from "../Models/Patient.Model.js";

async function getReportbyUser(req, res) {
  try {
    const reports = await Report.find({ patient: req.user._id }).populate(
      "doctor"
    );
    res.status(200).json(reports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function setDetails(req, res) {
  try {
    const { reportId } = req.params;
    console.log(reportId);
    const report = await Report.findById(reportId);
    console.log(report);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }
    report.medications = req.body.medications;
    report.diagnosis = req.body.diagnosis;
    await report.save();
    res.status(200).json({
      success: true,
      message: "Report updated successfully.",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update report.",
      error: error.message,
    });
  }
}
// Save first report (POST request)
async function setFirstReport(req, res) {
  try {
    const { doctorId, symptoms } = req.body;
    const patientId = req.user?._id;

    if (!doctorId || !patientId || !symptoms) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    console.log("Doctor found:", doctor._id);
    console.log("Patient found:", patientId);
    console.log("Symptoms provided:", symptoms);

    // Create a new report entry
    const report = new Report({
      doctor: doctor._id, // Ensure only the ID is stored
      patient: patientId,
      symptoms,
      initialConsultation: true,
      status: "NotCompleted",
      date_of_creation: new Date(),
    });

    await report.save();

    res.status(201).json({ message: "Report saved successfully", report });
  } catch (error) {
    console.error("Error saving report:", error);
    res
      .status(500)
      .json({ error: "Error saving report", details: error.message });
  }
}

async function getreports(req, res) {
  const user = req.user;
  console.log(user);
  try {
    const report = await Report.find({ doctor: user._id }).populate("patient");
    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients.",
      error: error.message,
    });
  }
}

async function getReport(req, res) {
  try {
    const { reportId } = req.params;
    console.log(reportId);
    const report = await Report.findById(reportId).populate("doctor patient");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
      error: error.message,
    });
  }
}

async function sendDiagnosis(req, res) {
  try {
    const { reportID, message } = req.body;
    console.log(reportID, message);

    const updatedReport = await Report.findByIdAndUpdate(reportID, {
      diagnosis: message,
    });

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Diagnosis updated successfully", updatedReport });
  } catch (error) {
    console.error("Error updating diagnosis:", error);
    res.status(500).json({ error: "Failed to update diagnosis" });
  }
}

async function sendSuggestion(req, res) {
  try {
    const { reportID, message } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(reportID, {
      suggestions: message,
    });

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Suggestion updated successfully", updatedReport });
  } catch (error) {
    console.error("Error updating suggestion:", error);
    res.status(500).json({ error: "Failed to update suggestion" });
  }
}

async function sendPrescription(req, res) {
  try {
    const { reportID, message } = req.body;

    const updatedReport = await Report.findByIdAndUpdate(reportID, {
      $push: { medications: message },
    });

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Prescription updated successfully", updatedReport });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ error: "Failed to update prescription" });
  }
}
// Export function
export {
  setFirstReport,
  getReport,
  setDetails,
  getReportbyUser,
  getreports,
  sendDiagnosis,
  sendSuggestion,
  sendPrescription,
};
