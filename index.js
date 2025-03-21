import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./Utils/db.js";
import authRoutes from "./Routes/User.Routes.js";
import doctorRoutes from "./Routes/Doctor.Routes.js";
import reportRoutes from "./Routes/Report.Routes.js";
import patientRoutes from "./Routes/Patient.Routes.js";

const app = express();
dotenv.config();
connectDB();
const PORT = 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/patient", patientRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
