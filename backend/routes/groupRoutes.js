const express = require("express");
const Group = require("../models/GroupModel");
const { protect, isAdmin } = require("../middleware/authMiddleware");
// const streamifier = require("streamifier");
const groupRouter = express.Router();
const upload = require("../middleware/multer");
const cloudinary = require("../cloudinary");
const User = require("../models/UserModel");

//Create a new group
groupRouter.post("/", protect, upload.single("profilePic"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const admin = await User.findById(req.user._id);
    // const user = await User.findById(req.user._id); 
    let profilepicUrl = "";

    if (req.file) {
      // Wrap upload_stream in a Promise
      profilepicUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "Group-profiles",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        stream.end(req.file.buffer); 
      });
    }

    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
      profilePic: profilepicUrl,
    });
    admin.groups.push(group._id);
    await admin.save();
    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "username email profilePic")
      .populate("members", "username email profilePic");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Group creation error:", error);
    res.status(400).json({ message: error.message });
  }
});

groupRouter.get("/:groupId/members", protect, async (req, res) => {
  try{
    const group = await Group.findById(req.params.groupId).populate("members", "username email profilePic");
    res.json(group.members);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
})

groupRouter.get("/", protect, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("admin", "username email profilePic")
      .populate("members", "username email profilePic");
    res.json(groups);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupRouter.get("/:groupId", protect, async (req, res) => {
  try{
    const group = await Group.findById(req.params.groupId).populate("admin", "username email profilePic").populate("members", "username email profilePic");
    res.json(group);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
})

groupRouter.post("/:groupId/join", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    const user = await User.findById(req.user._id); 
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already a member of this group",
      });
    }
    group.members.push(req.user._id);
    await group.save();
    user.groups.push(group._id);
    await user.save();
    res.json({ message: "Successfully joined this group" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupRouter.post("/:groupId/leave", protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    const user = await User.findById(req.user._id); // Add this line to get the user
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (!group.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Not a member of this group" });
    }
    group.members = group.members.filter((memberId) => {
      return memberId.toString() !== req.user._id.toString();
    });
    await group.save();
    user.groups = user.groups.filter(
      (groupId) => groupId.toString() !== group._id.toString()
    );
    await user.save();
    res.json({ message: "Successfully left the group" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

groupRouter.get("/user/joined-groups", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "groups",
        select: "name description admin members profilePic createdAt",
        populate: [
          {
            path: "admin",
            select: "username email profilePic"
          },
          {
            path: "members",
            select: "username email profilePic"
          }
        ]
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = groupRouter;