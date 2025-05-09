const express = require("express");
const Personal = require("../models/PersonalChatModel");
const { protect } = require("../middleware/authMiddleware");
const PersonalRouter = express.Router();

PersonalRouter.post("/", protect, async (req, res) => {
  try {
    const { content, chatid } = req.body;
    const message = await Personal.create({
      sender: req.user._id,
      content,
      chatid: chatid,
    });
    const populatedMessage = await Personal.findById(message._id).populate(
      "sender",
      "username email profilePic"
    );
    res.json(populatedMessage);
  } catch (error) {
    console.log("ERROR:",error);
    
    res.status(400).json({ message: error.Message });
  }
});

PersonalRouter.get("/:chatid", protect, async (req, res) => {
  try {
    const messages = await Personal.find({ chatid: req.params.chatid })
      .populate("sender", "username email profilePic")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.Message });
  }
});
module.exports = PersonalRouter;