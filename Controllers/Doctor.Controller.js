import { Doctor } from "../Models/Doctor.Model";

//All docs
async function getAllDoctors(req, res) {
    try {
        const doctors = await Doctor.find({}).select("-password -refreshToken");
        res.status(200).json({
        success: true,
        count: doctors.length,
        doctors,
        });
    } 
    catch (error) {
        res.status(500).json({
        success: false,
        message: "Failed to fetch doctors.",
        error: error.message,
        });
    }
}

//Domain Specific Docs
async function getAllDomainDoctors(req,res){
    try {
        const { speciality } = req.query;

        let query = {};
        if (speciality) {
          query.speciality = speciality.toLowerCase(); 
        }
    
        console.log(query);
        const doctors = await Doctor.find(query).select("-password -refreshToken");
        console.log(doctors);
        res.status(200).json({
          success: true,
          count: doctors.length,
          doctors,
        });
    } 
    catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch doctors.",
          error: error.message,
        });
    }
}

//Get Current Doc
async function getCurrentDoctor(req, res) {
    try {
        const doctor = await Doctor.findById(req.user._id).select("-password -refreshToken");
        res.status(200).json({
        success: true,
        doctor,
        });
    } 
    catch (error) {
        res.status(500).json({
        success: false,
        message: "Failed to fetch doctor.",
        error: error.message,
        });
    }
}

export { getAllDoctors,getAllDomainDoctors,getCurrentDoctor };