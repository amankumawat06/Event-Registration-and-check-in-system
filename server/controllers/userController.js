import { User } from "../models/userModel.js";
import { Event } from "../models/eventModel.js";
import { Booking } from "../models/bookingModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "required fields can not be empty!",
      });
    }

    if (phone.length !== 10) {
      return res.status(400).json({
        message: "Please enter a valid mobile number!",
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 charachters!",
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let image = [
      {
        imageUrl:
          "https://res.cloudinary.com/dft3lgysm/image/upload/v1792118394/EventHub/Users/qhq9vggi7iatfp4zjgj0.jpg",
        imageId: "EventHub/Users/qhq9vggi7iatfp4zjgj0",
      },
    ];

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "EventHub/Users",
      );

      image = [
        {
          imageUrl: result.secure_url,
          imageId: result.public_id,
        },
      ];
    }

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      image,
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
        image: newUser.image,
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

    if (user.image[0].imageId) {
      const deletedImage = await cloudinary.uploader.destroy(
        user.image[0].imageId,
      );
    }

    await Booking.deleteMany({ userId: userId });

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

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "user Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user Id",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "user not found!",
      });
    }

    const { name, email } = req.body || {};

    if (!name && !email && !req.file) {
      return res.status(200).json({
        message: "You haven't updated anything in this data!",
      });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    if (req.file) {
      if (user.image[0].imageId) {
        await cloudinary.uploader.destroy(user.image[0].imageId);
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        "EventHub/Users",
      );

      user.image = [
        {
          imageUrl: result.secure_url,
          imageId: result.public_id,
        },
      ];
    }

    await user.save();

    return res.status(200).json({
      message: "User data upadted successfully!",
      updatedData: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to update details!",
      error: err.image,
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
