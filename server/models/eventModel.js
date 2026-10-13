import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    maxQuantity: {
      type: Number,
      required: true,
    },
    bookedSeats: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
