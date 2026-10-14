import { Booking } from "../models/bookingModel.js";
import { Event } from "../models/eventModel.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  try {
    const { eventId, quantity, bookingDate } = req.body || {};
    const userId = req.user.id;

    if (!eventId || quantity == null) {
      return res.status(400).json({
        message: "Event ID and quantity are required",
      });
    }

    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({
        message: "Invalid Event ID",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const existingBooking = await Booking.findOne({
      eventId,
      userId,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You have already booked this event",
      });
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: {
          $lte: [{ $add: ["$bookedSeats", quantity] }, "$maxQuantity"],
        },
      },
      {
        $inc: { bookedSeats: quantity },
      },
      { new: true },
    );

    if (!event) {
      const exists = await Event.exists({ _id: eventId });

      return res.status(exists ? 400 : 404).json({
        message: exists ? "Not enough seats available" : "Event not found",
      });
    }

    try {
      const booking = await Booking.create({
        eventId,
        userId,
        quantity,
        bookingDate,
      });

      return res.status(201).json({
        message: "Booking created successfully",
        booking,
        availableSeats: event.maxQuantity - event.bookedSeats,
      });
    } catch (error) {
      // Restore reserved seats if saving the booking fails
      await Event.updateOne(
        { _id: eventId },
        { $inc: { bookedSeats: -quantity } },
      );

      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

export const AllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId", "name email phone")
      .populate("eventId");

    if (bookings.length === 0) {
      return res.status(200).json({
        message: "No bookings found so far",
      });
    }

    return res.status(200).json({
      message: "All bookings fetched!",
      total: bookings.length,
      bookings,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch bookings!",
      error: err.message,
    });
  }
};

export const getMyBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("eventId", "name description date time venue")
      .populate("userId", "name email phone");

    if (bookings.length === 0) {
      return res.status(200).json({
        message: "You haven't booked any event so far!",
      });
    }

    return res.status(200).json({
      message: "booking fetched successfully!",
      totalBookings: bookings.length,
      bookings,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch booking!",
      error: err.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "booking id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid booking Id",
      });
    }

    const booking = await Booking.findOne({ _id: id, userId: req.user.id });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found!",
      });
    }

    const event = await Event.findById(booking.eventId);

    if (!event) {
      return res.status(404).json({
        message: "Associated event not found",
      });
    }

    event.bookedSeats = Math.max(0, event.bookedSeats - booking.quantity); //prevenst the result from dropping below 0
    await event.save();
    await Booking.deleteOne({ _id: booking._id });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      deletedBooking: booking,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete booking",
      error: err.message,
    });
  }
};

export const markCheckedIn = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "booking Id is required!",
      });
    }

    if (!mongoose.isObjectIdOrHexString(id)) {
      return res.status(400).json({
        message: "Invalid booking Id",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found!",
      });
    }

    if (booking.status === "checked-In") {
      return res.status(400).json({
        message: "Booking has already marked as checked-In",
      });
    }

    booking.status = "checked-In";
    await booking.save();

    return res.status(200).json({
      message: "Booking has marked to checked-In",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to updated status",
      error: err.message,
    });
  }
};
