import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: true,
    },
    status: {
      type: String,
      enum: ["regsitered", "checked-In"],
      default: "regsitered",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

bookingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const Booking = mongoose.model("Booking", bookingSchema);
