const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
  getEventAttendees,
} = require("../controllers/eventController");

// Public routes
router.get("/", getAllEvents);

// Protected routes
router.use(verifyToken);
router.get("/:id", getEventById);
router.post("/rsvp/:id", rsvpEvent);
router.delete("/rsvp/:id", cancelRSVP);
router.get("/attendees/:id", getEventAttendees);

// Admin routes
router.use(isAdmin);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
