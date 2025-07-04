import express from "express";
import {
  getDiscussionsByCommunity,
  setNewDisussion,
} from "../Controllers/Community.Controller.js";
import { verifyPatientToken } from "../Utils/Token.Middleware.js";

const router = express.Router();

// Route to get discussions by community name
router.get("/getcommunitydiscussion/:communityName", getDiscussionsByCommunity);
router.post(
  "/addnewdiscussion/:communityName",
  verifyPatientToken,
  setNewDisussion
);
export default router;
