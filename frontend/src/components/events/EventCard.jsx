import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';
import Button from '../common/Button';

const EventCard = ({ event, onRSVP, userId = null }) => {
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl.startsWith('data:image') ? event.imageUrl : `data:image/jpeg;base64,${event.imageUrl}`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-xl font-semibold truncate">{event.title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <FiCalendar className="mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiClock className="mr-2" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiMapPin className="mr-2" />
            <span className="truncate">{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiUsers className="mr-2" />
            <span>{event.attendees?.length || 0} / {event.capacity} attendees</span>
          </div>
        </div>

        <p className="mt-3 text-gray-600 line-clamp-2">{event.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {event.category}
          </span>
          <Button
            variant="outline"
            size="small"
            icon={<FiArrowRight />}
            onClick={() => window.location.href = `/events/${event._id}`}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
