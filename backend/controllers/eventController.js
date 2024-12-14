const Event = require("../models/Event");
const { validateEvent } = require("../utils/validation");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      capacity,
      category,
      imageBase64,
      isPrivate
    } = req.body;

    const validation = validateEvent({
      title,
      description,
      date,
      time,
      location,
      capacity,
      category,
      imageBase64
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    let imageUrl = '';
    if (imageBase64) {
      imageUrl = imageBase64;
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
      capacity: parseInt(capacity),
      category: category.toLowerCase(),
      imageUrl,
      organizer: req.user.id,
      isPrivate: Boolean(isPrivate)
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username email')
      .populate('attendees.user', 'username email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent,
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "username email")
      .populate("attendees.user", "username email")
      .sort({ startDateTime: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "username email")
      .populate("attendees.user", "username email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("organizer", "username email")
      .populate("attendees.user", "username email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating event",
      error: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.user.id,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting event",
      error: error.message,
    });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (event.attendees.length >= event.capacity) {
      return res.status(406).json({
        success: false,
        message: "Event is at full capacity",
      });
    }

    const existingRSVP = event.attendees.find(
      (attendee) => attendee.user.toString() === userId
    );

    if (existingRSVP) {
      return res.status(403).json({
        success: false,
        message: "You have already RSVP'd to this event",
      });
    }

    event.attendees.push({
      user: userId,
      registrationDate: new Date(),
      status: "confirmed",
    });

    await event.save();

    const updatedEvent = await Event.findById(eventId)
      .populate("organizer", "username email")
      .populate("attendees.user", "username email");

    res.status(200).json({
      success: true,
      message: "Successfully RSVP'd to event",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error RSVPing to event",
      error: error.message,
    });
  }
};

const cancelRSVP = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const attendeeIndex = event.attendees.findIndex(
      (attendee) => attendee.user.toString() === userId
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "You have not RSVP'd to this event",
      });
    }

    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    const updatedEvent = await Event.findById(eventId)
      .populate("organizer", "username email")
      .populate("attendees.user", "username email");

    res.status(200).json({
      success: true,
      message: "Successfully cancelled RSVP",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling RSVP",
      error: error.message,
    });
  }
};

const getEventAttendees = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId)
      .populate("attendees.user", "username email")
      .select("attendees");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event.attendees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attendees",
      error: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
  getEventAttendees,
};
