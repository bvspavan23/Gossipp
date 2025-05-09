const express = require("express");
const User = require("../models/UserModel");
const { protect, isAdmin } = require("../middleware/authMiddleware");
// const streamifier = require("streamifier");
const personRouter = express.Router();
const upload = require("../middleware/multer");
const cloudinary = require("../cloudinary");

personRouter.get("/", protect, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

personRouter.get("/myconnections", protect, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate(
        "connections",
        "username email profilePic"
      );
  
      res.json(user.connections);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});
personRouter.get("/:userId", protect, async (req, res) => {
  try{
    const user = await User.findById(req.params.userId);
    res.json(user);
  }
  catch(error){
    res.status(400).json({message: error.message});
  }
})

personRouter.post("/:userId/connect", protect, async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.userId);
      const currentUser = await User.findById(req.user._id);
  
      if (!targetUser || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (
        targetUser.connections.includes(currentUser._id) &&
        currentUser.connections.includes(targetUser._id)
      ) {
        return res.status(400).json({ message: "Already connected to this user" });
      }
  
      if (!targetUser.connections.includes(currentUser._id)) {
        targetUser.connections.push(currentUser._id);
      }
  
      if (!currentUser.connections.includes(targetUser._id)) {
        currentUser.connections.push(targetUser._id);
      }
  
      await targetUser.save();
      await currentUser.save();
  
      // Populate connections if needed (optional)
      const populatedTargetUser = await User.findById(targetUser._id).populate(
        "connections",
        "username email profilePic"
      );
      const populatedCurrentUser = await User.findById(currentUser._id).populate(
        "connections",
        "username email profilePic"
      );
  
      res.json({
        message: "Successfully connected to this user",
        currentUser: populatedCurrentUser,
        targetUser: populatedTargetUser,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  

  personRouter.post("/:userId/remove", protect, async (req, res) => {
    try {
      const targetUser = await User.findById(req.params.userId);
      const currentUser = await User.findById(req.user._id);
      if (!targetUser || !currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const isConnected =
        targetUser.connections.includes(currentUser._id) &&
        currentUser.connections.includes(targetUser._id);
      if (!isConnected) {
        return res.status(400).json({ message: "Not connected to this user" });
      }
      // Remove currentUser from targetUser's connections
      targetUser.connections = targetUser.connections.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      // Remove targetUser from currentUser's connections
      currentUser.connections = currentUser.connections.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );
      await targetUser.save();
      await currentUser.save();
      // Optionally populate if you want full user info back
      const populatedTargetUser = await User.findById(targetUser._id).populate(
        "connections",
        "username email profilePic"
      );
      const populatedCurrentUser = await User.findById(currentUser._id).populate(
        "connections",
        "username email profilePic"
      );
  
      res.json({
        message: "Successfully removed connection",
        currentUser: populatedCurrentUser,
        targetUser: populatedTargetUser,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

module.exports = personRouter;