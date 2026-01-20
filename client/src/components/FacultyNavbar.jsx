import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';

const FacultyNavbar = () => {
  const navigate = useNavigate();
  const facultyName = localStorage.getItem('facultyName') || 'Faculty';

  const handleLogout = () => {
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyName');
    navigate('/faculty-login');
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Title */}
          <div className="flex items-center">
            <Link to="/faculty-dashboard" className="flex items-center gap-2 text-white hover:text-indigo-200 transition">
              <Home size={24} />
              <span className="text-xl font-semibold">Faculty Dashboard</span>
            </Link>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center gap-4">
            <span className="text-white text-sm">
              Welcome, <span className="font-semibold">{facultyName}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FacultyNavbar;
