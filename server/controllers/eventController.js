import mongoose from "mongoose";
import { Event } from "../models/eventModel.js";

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, time, venue, maxQuantity, bookedSeats } =
      req.body || {};
    const createdBy = req.user.id;

    if (!name || !description || !date || !time || !venue || !maxQuantity) {
      return res.status(400).json({
        message: "Required fields can not be empty!",
      });
    }

    const existingEvent = await Event.findOne({ name, date, time });
    if (existingEvent) {
      return res.status(400).json({
        message: "Event already exists",
      });
    }

    const event = new Event({
      name,
      description,
      date,
      time,
      venue,
      maxQuantity,
      bookedSeats,
      createdBy,
    });

    await event.save();
    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate(
      "createdBy",
      "name email phone",
    );

    if (events.length === 0) {
      return res.status(200).json({
        message: "No events found",
        events: [],
      });
    }

    return res.status(200).json({
      message: "Events retrieved successfully",
      totalEvents: events.length,
      events,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to retrieve events",
      error: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(id).populate(
      "createdBy",
      "name email phone",
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event retrieved successfully",
      event,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to retrieve event",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Event Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event Id",
      });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found!",
      });
    }

    const { name, description, date, time, venue } = req.body || {};

    if (!name && !description && !date && !time && !venue) {
      return res.status(200).json({
        message: "You haven't updated anything in this data",
      });
    }

    if (name !== undefined) event.name = name;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (venue !== undefined) event.venue = venue;

    await event.save();

    return res.status(200).json({
      message: "Event data is updated!",
      updatedEvent: event,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update event!",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      message: "Event deleted successfully",
      deletedEvent: event,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};
