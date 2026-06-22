import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar
} from 'recharts';
import { Users, BookOpen, DollarSign, Shield, CheckCircle, Compass, AlertCircle, MapPin } from 'lucide-react';

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingMentors, setPendingMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, pendingRes] = await Promise.all([
        API.get('/api/admin/analytics'),
        API.get('/api/admin/mentors/pending'),
      ]);
      setAnalytics(analyticsRes.data);
      setPendingMentors(pendingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyMentor = async (profileId) => {
    setVerifyLoading(prev => ({ ...prev, [profileId]: true }));
    try {
      await API.put(`/api/admin/mentors/${profileId}/verify`);
      setPendingMentors(prev => prev.filter(m => m.id !== profileId));
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyLoading(prev => ({ ...prev, [profileId]: false }));
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 shadow-xl">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Compass className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const cityData = analytics ? Object.entries(analytics.cityWiseUsage).map(([city, count]) => ({ city, count })) : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Admin Control Panel</h1>
        <p className="text-slate-400 text-sm mt-1">Platform analytics, mentor verification, and growth monitoring.</p>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass-card p-5 rounded-3xl space-y-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 w-fit rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Drivers</p>
            <p className="text-3xl font-black text-white">{analytics?.totalDrivers || 0}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-5 rounded-3xl space-y-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 w-fit rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Mentors</p>
            <p className="text-3xl font-black text-white">{analytics?.totalMentors || 0}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-5 rounded-3xl space-y-3">
          <div className="p-2.5 bg-green-500/10 text-green-400 w-fit rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Bookings</p>
            <p className="text-3xl font-black text-white">{analytics?.totalBookings || 0}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-5 rounded-3xl space-y-3">
          <div className="p-2.5 bg-orange-500/10 text-orange-400 w-fit rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-black text-white">₹{((analytics?.totalRevenue || 0) / 1000).toFixed(1)}K</p>
          </div>
        </motion.div>
      </div>

      {/* Growth Chart */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-1">Platform Growth (Last 7 Days)</h3>
        <p className="text-xs text-slate-500 mb-6">Tracking users, bookings, and simulated revenue trends</p>
        {analytics?.growthData && (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.growthData}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="users" name="Users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* City-wise Usage Bar Chart */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-1">City-Wise Booking Distribution</h3>
        <p className="text-xs text-slate-500 mb-6">Regional usage across covered Indian cities</p>
        {cityData.length > 0 && (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" />
                <XAxis dataKey="city" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Pending Mentor Verification */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Pending Mentor Approvals</h3>
            <p className="text-xs text-slate-500 mt-1">Review and verify mentor profiles to activate their marketplace listing</p>
          </div>
          {pendingMentors.length > 0 && (
            <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
              {pendingMentors.length} Pending
            </span>
          )}
        </div>

        {pendingMentors.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto" />
            <p className="text-slate-400 text-sm">All mentor applications have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMentors.map(mentor => (
              <div key={mentor.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-950/50 border border-slate-900 rounded-2xl gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={mentor.user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.user?.fullName}`}
                    alt=""
                    className="w-12 h-12 rounded-xl border border-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{mentor.user?.fullName}</h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{mentor.user?.city}</span>
                      <span>·</span>
                      <span>{mentor.experienceYears} yrs exp.</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{mentor.languages} · {mentor.vehicleTypes}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">₹{mentor.hourlyRate}/hr</span>
                  </div>
                  <button
                    onClick={() => verifyMentor(mentor.id)}
                    disabled={verifyLoading[mentor.id]}
                    className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-500 disabled:bg-green-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors glow-green"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{verifyLoading[mentor.id] ? 'Verifying...' : 'Approve & Verify'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
