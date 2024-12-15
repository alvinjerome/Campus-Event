import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { getEvents } from '../services/eventService';
import { toast } from 'sonner';
import EventCard from '../components/events/EventCard';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  const categories = ['all', ...new Set(events.map(event => event.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Campus Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and join exciting events happening on campus
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No events found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 