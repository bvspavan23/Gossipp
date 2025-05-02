const express = require("express");
const User = require("../models/UserModel");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const cloudinary = require("../cloudinary");
//Register route
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
          profilePic: user.profilePic,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/profile", protect, async (req, res) => {
  console.log("REQUESTED USER FOR PROFILE", req.user);
  const user = await User.findById(req.user.id);
  console.log("USER from DB", user);
  if (!user) {
    throw new Error("User not found");
  }
  res.json({
    username: user.username,
    email: user.email,
    profilepic: user.profilePic,
  });
});

userRouter.put("/change-password", protect, async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findById(req.user);
  if (!user) {
    throw new Error("User not found");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  //! ReSave
  await user.save({
    validateBeforeSave: false,
  });
  //!Send the response
  res.json({ message: "Password Changed successfully" });
});

//! update user profile
userRouter.put(
  "/update-profile",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { email, username } = req.body;
      let profilepicUrl;
      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "Chat-profiles",
          },
          async (error, result) => {
            if (error) return res.status(500).json({ error: error.message });

            profilepicUrl = result.secure_url;

            const updatedUser = await User.findByIdAndUpdate(
              req.user._id,
              {
                username,
                email,
                profilePic: profilepicUrl,
              },
              { new: true }
            );

            return res.json({ message: "User profile updated", updatedUser });
          }
        );

        // Manually pipe the file buffer to the Cloudinary upload_stream
        require("streamifier").createReadStream(req.file.buffer).pipe(result);
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          {
            username,
            email,
          },
          { new: true }
        );
        res.json({ message: "User profile updated", updatedUser });
      }
    } catch (err) {
      console.error("Update failed", err);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = userRouter;
