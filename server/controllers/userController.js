import { User } from "../models/userModel.js";
import { Event } from "../models/eventModel.js";
import { Booking } from "../models/bookingModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import mongoose from "mongoose";

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (phone.length != 10) {
      return res.status(400).json({
        message: "Please enter a valid mobile number!",
      });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();

    return res.status(201).json({
      message: "Account created successfully",
      newUser: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create account",
      error: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const authToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.jwtSecret,
      {
        expiresIn: "2d",
      },
    );

    res.cookie("auth_access", authToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    return res.status(200).json({
      message: "User details reterived successfully!",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get detail!",
      error: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found",
        users: [],
      });
    }
    return res.status(200).json({
      message: "Users found",
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Booking.deleteMany({userId: userId});

    return res.status(200).json({
      message: "User and its related event data has been deleted!",
      deletedUser: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("auth_access", {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to logout!",
    });
  }
};
