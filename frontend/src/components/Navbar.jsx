import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, Shield, Compass, BarChart2, BookOpen, User, Menu, X } from 'lucide-react';
import API from '../services/api';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isAuthenticated) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      interval = setInterval(fetchNotifications, 30000);
    }
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    // Close dropdowns on route change
    setShowNotifications(false);
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const endpoint = user.role === 'DRIVER' ? '/api/drivers/notifications' : '/api/drivers/notifications'; // use general endpoint or driver endpoint
      const response = await API.get('/api/drivers/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/api/drivers/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="glass-nav sticky top-0 z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          <Compass className="w-8 h-8 text-cyan-400 animate-spin-slow" />
          <span>DriveMentor</span>
        </Link>

        {/* Desktop Links */}
        {isAuthenticated ? (
          <div className="hidden md:flex items-center space-x-8">
            {user.role === 'DRIVER' && (
              <>
                <Link to="/driver-dashboard" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/driver-dashboard' ? 'text-cyan-400 glow-text-blue' : 'text-slate-300'}`}>
                  Dashboard
                </Link>
                <Link to="/marketplace" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/marketplace' ? 'text-cyan-400 glow-text-blue' : 'text-slate-300'}`}>
                  Find Mentor
                </Link>
                <Link to="/progress" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/progress' ? 'text-cyan-400 glow-text-blue' : 'text-slate-300'}`}>
                  Progress Tracker
                </Link>
              </>
            )}
            {user.role === 'MENTOR' && (
              <>
                <Link to="/mentor-dashboard" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/mentor-dashboard' ? 'text-cyan-400 glow-text-blue' : 'text-slate-300'}`}>
                  Mentor Dashboard
                </Link>
              </>
            )}
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin-panel" className={`text-sm font-medium transition-colors hover:text-cyan-400 ${location.pathname === '/admin-panel' ? 'text-cyan-400 glow-text-blue' : 'text-slate-300'}`}>
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Home</Link>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Find a Mentor</Link>
            <Link to="/register?role=MENTOR" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Become a Mentor</Link>
          </div>
        )}

        {/* Action Panel */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-[#0F172A]" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl glow-blue shadow-2xl p-4 z-50 text-slate-200">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                      <span className="font-bold text-sm">Notifications</span>
                      <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {notifications.length === 0 ? (
                        <div className="text-center text-xs text-slate-500 py-6">No notifications yet.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                            className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${notif.isRead ? 'bg-slate-900/40 text-slate-400' : 'bg-slate-800/80 text-slate-100 hover:bg-slate-800'}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-semibold">{notif.title}</span>
                              {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                            </div>
                            <p className="mt-1 text-slate-400 leading-normal">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Info */}
              <div className="hidden md:flex items-center space-x-3 bg-slate-800/40 border border-slate-700/50 rounded-full py-1 pl-2 pr-4">
                <img 
                  src={user.profilePicture || "https://api.dicebear.com/7.x/bottts/svg"} 
                  alt={user.fullName} 
                  className="w-7 h-7 rounded-full border border-cyan-500/30"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold leading-none">{user.fullName}</span>
                  <span className="text-[10px] text-cyan-400 mt-0.5 leading-none uppercase tracking-wider">{user.role}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors glow-blue"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 space-y-4 flex flex-col px-4 pb-4 bg-slate-950/90 rounded-2xl">
          {isAuthenticated ? (
            <>
              {user.role === 'DRIVER' && (
                <>
                  <Link to="/driver-dashboard" className="text-sm font-medium text-slate-300 hover:text-white">Dashboard</Link>
                  <Link to="/marketplace" className="text-sm font-medium text-slate-300 hover:text-white">Find Mentor</Link>
                  <Link to="/progress" className="text-sm font-medium text-slate-300 hover:text-white">Progress Tracker</Link>
                </>
              )}
              {user.role === 'MENTOR' && (
                <Link to="/mentor-dashboard" className="text-sm font-medium text-slate-300 hover:text-white">Mentor Dashboard</Link>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin-panel" className="text-sm font-medium text-slate-300 hover:text-white">Admin Panel</Link>
              )}
              <div className="flex items-center space-x-3 py-2 border-t border-slate-800">
                <img src={user.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">{user.fullName}</div>
                  <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-400 font-medium text-sm pt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white">Home</Link>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white">Find a Mentor</Link>
              <Link to="/register?role=MENTOR" className="text-sm font-medium text-slate-300 hover:text-white">Become a Mentor</Link>
              <Link to="/login" className="text-sm font-medium text-center border border-slate-700 text-slate-300 rounded-full py-2 hover:bg-slate-800 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm font-semibold text-center bg-blue-600 text-white rounded-full py-2 hover:bg-blue-500 transition-colors glow-blue">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
