import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { DollarSign, Clock, Star, Users, CheckCircle, XCircle, Compass, Shield, AlertCircle } from 'lucide-react';
import FeedbackSubmitModal from '../components/FeedbackSubmitModal';

const MentorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/mentors/dashboard');
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await API.put(`/api/bookings/${bookingId}/status`, { status });
      await fetchDashboard(); // refresh
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Compass className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-slate-400">Could not load mentor dashboard.</p>
          <button onClick={fetchDashboard} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome, {user.fullName}!</h1>
          <p className="text-slate-400 text-sm mt-1">Your mentorship performance at a glance</p>
        </div>
        {!data.isVerified && (
          <div className="flex items-center space-x-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Profile pending admin verification – your sessions will appear in marketplace once approved.</span>
          </div>
        )}
        {data.isVerified && (
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>Verified Mentor</span>
          </div>
        )}
      </div>

      {/* KPI Widgets Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-5 rounded-3xl flex flex-col space-y-3">
          <div className="p-2.5 bg-green-500/10 text-green-400 w-fit rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Earnings</p>
            <p className="text-2xl font-black text-white mt-1">₹{(data.earnings || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="glass-card p-5 rounded-3xl flex flex-col space-y-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 w-fit rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hours Taught</p>
            <p className="text-2xl font-black text-white mt-1">{(data.totalHours || 0).toFixed(1)}h</p>
          </div>
        </div>
        <div className="glass-card p-5 rounded-3xl flex flex-col space-y-3">
          <div className="p-2.5 bg-orange-500/10 text-orange-400 w-fit rounded-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Rating</p>
            <p className="text-2xl font-black text-white mt-1">{(data.rating || 5).toFixed(1)} ⭐</p>
          </div>
        </div>
        <div className="glass-card p-5 rounded-3xl flex flex-col space-y-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 w-fit rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sessions Done</p>
            <p className="text-2xl font-black text-white mt-1">{data.totalSessions || 0}</p>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="glass-card p-6 rounded-3xl space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">Pending Booking Requests</h3>
            <p className="text-xs text-slate-500 mt-1">Accept or decline driver requests</p>
          </div>
          {data.pendingSessions.length > 0 && (
            <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
              {data.pendingSessions.length} Pending
            </span>
          )}
        </div>

        {data.pendingSessions.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">No pending session requests right now. 🎉</div>
        ) : (
          <div className="space-y-4">
            {data.pendingSessions.map(booking => (
              <SessionCard
                key={booking.id}
                booking={booking}
                actionLoading={actionLoading}
                actions={
                  <div className="flex space-x-3">
                    <button
                      onClick={() => updateStatus(booking.id, 'ACCEPTED')}
                      disabled={actionLoading[booking.id]}
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-500 disabled:bg-green-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors glow-green"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, 'REJECTED')}
                      disabled={actionLoading[booking.id]}
                      className="flex items-center space-x-1 bg-red-600/30 hover:bg-red-600/50 text-red-400 text-xs font-bold px-4 py-2 rounded-xl border border-red-600/20 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Sessions */}
      <div className="glass-card p-6 rounded-3xl space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white">Upcoming Sessions</h3>
          <p className="text-xs text-slate-500 mt-1">Accepted sessions scheduled for upcoming dates</p>
        </div>

        {data.upcomingSessions.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">No upcoming sessions scheduled.</div>
        ) : (
          <div className="space-y-4">
            {data.upcomingSessions.map(booking => (
              <SessionCard
                key={booking.id}
                booking={booking}
                actionLoading={actionLoading}
                actions={
                  <button
                    onClick={() => updateStatus(booking.id, 'COMPLETED')}
                    disabled={actionLoading[booking.id]}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    Mark as Completed
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Past Sessions */}
      <div className="glass-card p-6 rounded-3xl space-y-5">
        <div>
          <h3 className="text-lg font-bold text-white">Past Sessions</h3>
          <p className="text-xs text-slate-500 mt-1">Completed sessions – submit feedback if not done yet</p>
        </div>

        {data.pastSessions.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">No past sessions yet.</div>
        ) : (
          <div className="space-y-4">
            {data.pastSessions.slice(0, 5).map(booking => (
              <SessionCard
                key={booking.id}
                booking={booking}
                actionLoading={actionLoading}
                actions={
                  booking.status === 'COMPLETED' ? (
                    <button
                      onClick={() => setFeedbackBooking(booking)}
                      className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold px-4 py-2 rounded-xl border border-cyan-500/20 transition-colors"
                    >
                      Submit Feedback
                    </button>
                  ) : (
                    <span className="text-xs text-slate-600 font-semibold uppercase">{booking.status}</span>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {feedbackBooking && (
        <FeedbackSubmitModal
          booking={feedbackBooking}
          onClose={() => setFeedbackBooking(null)}
          onSuccess={() => {
            setFeedbackBooking(null);
            fetchDashboard();
          }}
        />
      )}
    </div>
  );
};

const SessionCard = ({ booking, actions }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-950/50 border border-slate-900 rounded-2xl gap-4">
    <div className="flex items-center space-x-4">
      <img
        src={booking.driver?.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${booking.driver?.fullName}`}
        alt=""
        className="w-10 h-10 rounded-xl border border-slate-800"
      />
      <div>
        <h4 className="text-sm font-bold text-slate-100">{booking.driver?.fullName || 'Driver'}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{booking.date} · {booking.timeSlot}</p>
        <span className="text-[10px] text-cyan-400 font-semibold mt-1 inline-block">{booking.skillFocus}</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="text-right hidden md:block">
        <span className="text-sm font-bold text-white">₹{(booking.amountPaid || 0).toFixed(0)}</span>
        <p className="text-[10px] text-slate-500">Payout</p>
      </div>
      {actions}
    </div>
  </div>
);

export default MentorDashboard;
