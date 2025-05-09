const mongoose = require("mongoose");

const PersonalChatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    chatid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PersonalChats = mongoose.model("PersonalChats", PersonalChatSchema);
module.exports = PersonalChats;