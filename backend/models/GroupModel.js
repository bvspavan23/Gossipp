const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId,ref: "User" }],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilePic: {
      type: String,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;