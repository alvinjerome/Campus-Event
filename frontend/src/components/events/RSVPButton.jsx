import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { cancelRSVP } from "../../services/eventService";
import { motion } from "framer-motion";
import Button from "../common/Button";
import { FiCheck, FiX, FiCalendar } from "react-icons/fi";

const RSVPButton = ({ event, onRSVP }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [isUserRSVPed, setIsUserRSVPed] = useState(false);
  const [isEventFull, setIsEventFull] = useState(false);
  const [isEventPassed, setIsEventPassed] = useState(false);

  useEffect(() => {
    setIsUserRSVPed(
      event?.attendees?.some((attendee) => attendee?.user?._id === user?.id)
    );
    setIsEventFull(event?.attendees?.length >= event?.capacity);
    setIsEventPassed(new Date(event?.endDate) < new Date());
  }, [event, event?.attendees, event?.capacity, event?.endDate, user?.id]);

  const handleRSVPError = (error) => {
    if (error.code === 403) {
      toast.error("You've already RSVP'd to this event");
    } else if (error.code === 406) {
      toast.error("Event is at full capacity");
    } else {
      toast.error("Failed to RSVP. Please try again later.");
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      toast.error("Please login to RSVP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/event/rsvp/${event._id}`);
      onRSVP && onRSVP(response.data);
      toast.success("Successfully RSVP'd to event!");
    } catch (error) {
      handleRSVPError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    try {
      await cancelRSVP(event._id);
      onRSVP && onRSVP(event._id);
      toast.success("Successfully cancelled RSVP");
    } catch (error) {
      toast.error("Failed to cancel RSVP. Please try again later.");
    }
  };

  if (isEventPassed) {
    return (
      <div className="text-gray-500 flex items-center justify-center py-2 bg-gray-100 rounded-lg">
        <FiX className="mr-2" />
        Event has ended
      </div>
    );
  }

  return (
    <div className="flex items-center w-full gap-4">
      <Button
        variant={isUserRSVPed ? "success" : isEventFull ? "secondary" : "primary"}
        disabled={loading || isUserRSVPed || isEventFull}
        onClick={handleRSVP}
        fullWidth
        icon={isUserRSVPed ? <FiCheck /> : <FiCalendar />}
      >
        {loading ? "Processing..." : isUserRSVPed ? "RSVP'd" : isEventFull ? "Full" : "RSVP"}
      </Button>

      {isUserRSVPed && (
        <Button
          variant="danger"
          onClick={handleCancelRSVP}
          icon={<FiX />}
          size="small"
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default RSVPButton;
