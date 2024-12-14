import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import CreateEvent from './pages/CreateEvent';
import CalendarView from './pages/CalendarView';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen w-full flex flex-col bg-gray-50">
        <Toaster position="top-right" closeButton richColors style={
          {
          closeButton: {
            backgroundColor: 'red',
            color: 'white',
          }
        }
        } />
        <nav className="bg-blue-600 fixed top-0 left-0 right-0 z-50 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold">
                CampusEvents
              </Link>
              <div className="flex gap-6">
                <Link to="/events" className="hover:text-blue-200 transition-colors">Events</Link>
                <Link to="/calendar" className="hover:text-blue-200 transition-colors">Calendar</Link>
                <Link to="/create-event" className="hover:text-blue-200 transition-colors">Create Event</Link>
                <Link to="/register" className="hover:text-blue-200 transition-colors">Register</Link>
                <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 pt-16 w-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/create-event" element={<CreateEvent />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
