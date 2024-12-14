import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="w-full m-0 p-0">
      <div className="text-center py-24 px-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <h1 className="text-5xl font-bold mb-6 max-w-3xl mx-auto">Campus Events Hub</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8">Discover, Join, and Experience Amazing Campus Events</p>
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/events" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform hover:-translate-y-1 hover:shadow-lg">
            View Events
          </Link>
          <Link to="/register" className="px-6 py-3 bg-white text-blue-500 rounded-lg border-2 border-blue-500 hover:bg-blue-50 transition-transform hover:-translate-y-1 hover:shadow-lg">
            Sign Up Now
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-12 px-8">
        <h2 className="text-4xl font-bold mb-8 text-center">Featured Events</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {/* Event Card 1 */}
          <div className="flex-none w-[350px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 relative">
              {/* Replace with your image: <img src="/path-to-image.jpg" alt="Tech Summit" className="w-full h-full object-cover" /> */}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg font-semibold">MAR 25</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Tech Innovation Summit</h3>
              <p className="flex gap-4 text-gray-600 text-sm mb-4">
                <span className="flex items-center">📍 Main Auditorium</span>
                <span className="flex items-center">⏰ 2:00 PM</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">42 seats remaining</p>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                RSVP Now
              </button>
            </div>
          </div>

          {/* Event Card 2 */}
          <div className="flex-none w-[350px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 relative">
              {/* Replace with your image: <img src="/path-to-image.jpg" alt="Sports Event" className="w-full h-full object-cover" /> */}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg font-semibold">MAR 27</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Annual Sports Meet</h3>
              <p className="flex gap-4 text-gray-600 text-sm mb-4">
                <span className="flex items-center">📍 University Stadium</span>
                <span className="flex items-center">⏰ 9:00 AM</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">150 seats remaining</p>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                RSVP Now
              </button>
            </div>
          </div>

          {/* Event Card 3 */}
          <div className="flex-none w-[350px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 relative">
              {/* Replace with your image: <img src="/path-to-image.jpg" alt="Cultural Night" className="w-full h-full object-cover" /> */}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg font-semibold">MAR 30</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Cultural Night 2024</h3>
              <p className="flex gap-4 text-gray-600 text-sm mb-4">
                <span className="flex items-center">📍 Open Air Theatre</span>
                <span className="flex items-center">⏰ 6:30 PM</span>
              </p>
              <p className="text-sm text-gray-500 mb-4">85 seats remaining</p>
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                RSVP Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 