import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiUser } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { getEventById, deleteEvent } from '../services/eventService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Button from '../components/common/Button';
import RSVPButton from '../components/events/RSVPButton';

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();



  const fetchEventDetails = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (error) {
      setError('Failed to fetch event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleRSVPUpdate = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  const formatEventDate = (dateString) => {
    try {
      if (!dateString) return 'Date not available';
      const date = parseISO(dateString);
      return format(date, 'MMMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || 'Event not found'}</p>
          <Button variant="primary" onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isOrganizer = event.organizer?._id === user?.id;
  const canManageEvent = isAdmin || isOrganizer;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 sm:h-96">
            <img
              src={event.imageUrl?.startsWith('data:image') ? event.imageUrl : `data:image/jpeg;base64,${event.imageUrl}`}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {event.category}
                </span>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>{event.time || 'Time not specified'}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{event.location || 'Location not specified'}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <FiUsers className="mr-2" />
                  <span>{event.attendees?.length || 0} / {event.capacity || 'unlimited'} attendees</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiUser className="mr-2" />
                  <span>Organized by {event.organizer?.username || 'Unknown'}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{event.description || 'No description available'}</p>
                
                {/* RSVP and Action Buttons */}
                <div className="space-y-3 pt-4">
                  <RSVPButton event={event} onRSVP={handleRSVPUpdate} />
                  
                  {canManageEvent && (
                    <div className="flex gap-3 mt-4">
                      {/* <Button
                        variant="outline"
                        onClick={handleEdit}
                        fullWidth
                      >
                        Edit Event
                      </Button> */}
                      <Button
                        variant="danger"
                        onClick={handleDelete}
                        fullWidth
                      >
                        Delete Event
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage; 