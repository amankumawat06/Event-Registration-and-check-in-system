import mongoose from "mongoose";
import { Event } from "../models/eventModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "../config/cloudinary.js";

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, time, venue, maxQuantity, entryPrice } =
      req.body || {};
    const createdBy = req.user.id;

    if (
      !name ||
      !description ||
      !date ||
      !time ||
      !venue ||
      !maxQuantity ||
      !entryPrice
    ) {
      return res.status(400).json({
        message: "Required fields can not be empty!",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one image must to upload",
      });
    }

    const existingEvent = await Event.findOne({ name, date, time });
    if (existingEvent) {
      return res.status(400).json({
        message: "Event already exists",
      });
    }

    const images = [];

    for (let file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "EventHub/events");

      images.push({
        url: result.secure_url,
        imageId: result.public_id,
      });
    }

    const event = new Event({
      name,
      description,
      date,
      time,
      venue,
      maxQuantity,
      createdBy,
      entryPrice,
      images,
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
    const { page, limit } = req.query;

    let skip = (page - 1) * limit;

    const events = await Event.find()
      .populate("createdBy", "name email phone")
      .skip(skip)
      .limit(limit);

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

    const { name, description, date, time, venue, maxQuantity, entryPrice } =
      req.body || {};

    const hasnewFiles = req.files?.length > 0;

    if (maxQuantity !== undefined) {
      const capacity = Number(maxQuantity);

      if (!Number.isInteger(capacity) || capacity < 1) {
        return res.status(400).json({
          message: "Maximum capacity must be a positive whole number",
        });
      }

      if (capacity < event.bookedSeats) {
        return res.status(400).json({
          message: `Capacity cannot be less than already booked seats (${event.bookedSeats})`,
        });
      }

      event.maxQuantity = capacity;
    }

    if (
      !name &&
      !description &&
      !date &&
      !time &&
      !venue &&
      !maxQuantity &&
      !entryPrice &&
      !hasnewFiles
    ) {
      return res.status(200).json({
        message: "You haven't updated anything in this data",
      });
    }

    if (name !== undefined) event.name = name;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (time !== undefined) event.time = time;
    if (venue !== undefined) event.venue = venue;
    if (maxQuantity !== undefined) event.maxQuantity = maxQuantity;
    if (entryPrice !== undefined) event.entryPrice = entryPrice;

    if (req.files?.length > 0) {
      await Promise.all(
        event.images.map((image) => {
          cloudinary.uploader.destroy(image.imageId);
        }),
      );
      event.images = [];

      for (let file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "EventHub/events");

        event.images.push({
          url: result.secure_url,
          imageId: result.public_id,
        });
      }
    }

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

    await Promise.all(
      event.images.map((image) => {
        cloudinary.uploader.destroy(image.imageId);
      }),
    );

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
