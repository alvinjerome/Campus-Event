import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiPlus } from 'react-icons/fi';
import { getEvents } from '../services/eventService';
import { toast } from 'sonner';
import EventCard from '../components/events/EventCard';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    dateRange: 'all', // all, today, week, month
  });
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const filterEvents = () => {
    return events.filter(event => {
      // Category filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const eventDate = new Date(event.date);
        const today = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'week':
            const weekFromNow = new Date();
            weekFromNow.setDate(today.getDate() + 7);
            return eventDate <= weekFromNow && eventDate >= today;
          case 'month':
            const monthFromNow = new Date();
            monthFromNow.setMonth(today.getMonth() + 1);
            return eventDate <= monthFromNow && eventDate >= today;
          default:
            return true;
        }
      }

      return true;
    });
  };

  const categories = ['all', ...new Set(events.map(event => event.category))];
  const filteredEvents = filterEvents();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campus Events</h1>
          <p className="mt-2 text-gray-600">Discover and join exciting events happening around campus</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filter Toggle Button */}
            <Button
              variant="primary"
              icon={<FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
              size="medium"
            >
              Filters
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Events</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="secondary"
                icon={<FiX />}
                onClick={() => setFilters({ category: 'all', search: '', dateRange: 'all' })}
                size="small"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found matching your criteria.</p>
            {user?.role === 'admin' && (
              <Button
                variant="primary"
                icon={<FiPlus />}
                onClick={() => navigate('/create-event')}
                size="large"
              >
                Create New Event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userId={user?._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
