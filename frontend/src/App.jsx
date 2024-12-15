import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import CreateEvent from './pages/CreateEvent';
import CalendarView from './pages/CalendarView';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Nav from './components/nav';
import AdminRoute from './components/auth/AdminRoute';
import BecomeAdmin from './pages/BecomeAdmin';
import EventDetailsPage from './pages/EventDetailsPage';


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
        
        
        <main className="flex-1 pt-16 w-full">
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/create-event" element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
              } />
            <Route path="/become-admin" element={
              <ProtectedRoute>
                <BecomeAdmin />
              </ProtectedRoute>
              } />
            <Route path="/events/:id" element={<EventDetailsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
