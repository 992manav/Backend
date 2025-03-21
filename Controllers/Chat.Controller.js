import express from "express";
import {Message} from "../Models/Message.Model.js";

const router = express.Router();

router.get("/:sender/:receiver", async (req, res) => {
    const { sender, receiver } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });
  
    res.json(messages);
});

export default router;
  