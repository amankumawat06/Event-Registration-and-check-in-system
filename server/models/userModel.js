import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/,
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  image: [
    {
      imageUrl: {
        type: String,
        default: "avaitor.png",
      },
      imageId: {
        type: String,
        default: "defaultImageId/azzsdbj",
      },
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const User = mongoose.model("User", userSchema);
