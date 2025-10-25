
// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc Register a new user
// @route POST /api/users
// @access Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const normalizedEmail = (email || "").trim().toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const isAdmin =
      process.env.ADMIN_EMAIL &&
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase()
        ? true
        : false;

    const user = await User.create({
      name,
      email: normalizedEmail,
      password, // pre-save hook will hash this
      isAdmin,
      role: isAdmin ? "admin" : (role === "provider" ? "provider" : "customer"),
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      role: user.role,
        profilePicture: user.profilePicture || "",
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: (email || "").trim().toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if provider has a profile
      let providerProfileId = null;
      if (user.role === "provider" && user.providerProfileId) {
        providerProfileId = user.providerProfileId;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        profilePicture: user.profilePicture || "",
        providerProfileId: providerProfileId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        profilePicture: user.profilePicture || "",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture ?? user.profilePicture;
    if (req.body.password) {
      user.password = req.body.password; // pre-save hook will hash this
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profilePicture: updatedUser.profilePicture || "",
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};