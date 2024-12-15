import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';


const Nav = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav className="bg-blue-600 fixed top-0 left-0 right-0 z-50 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold">
                CampusEvents
              </Link>
              <div className="flex gap-6">
                <Link to="/events" className="hover:text-blue-200 transition-colors">Events</Link>
                <Link to="/calendar" className="hover:text-blue-200 transition-colors">Calendar</Link>
                {user ? (
                  user.role === 'admin' ? (
                    <>  
                    <Link to="/create-event" className="hover:text-blue-200 transition-colors">Create Event</Link>
                    <Link to="/#logout" onClick={()=>logout()} className="hover:text-red-200 text-red-500 transition-colors">Logout</Link>
                    </>

                  ):
                  (
                    <>
                      <Link to="/become-admin" className="hover:text-blue-200 transition-colors">Become an admin</Link>
                      <Link to="/#logout" onClick={()=>logout()} className="hover:text-red-200 text-red-500 transition-colors">Logout</Link>
                    </>
                  )
                ):
                ( 
                  <>
                  <Link to="/register" className="hover:text-blue-200 transition-colors">Register</Link>
                  <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                  </>
                )}
               
              </div>
            </div>
          </div>
        </nav>
    </div>
  );
};

export default Nav;