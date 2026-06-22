import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, BarChart, Bar
} from 'recharts';
import { TrendingUp, Clock, CheckSquare, Compass, AlertCircle } from 'lucide-react';

const ProgressTracker = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progress, books] = await Promise.all([
        API.get('/api/drivers/progress'),
        API.get('/api/bookings/driver'),
      ]);
      setProgressData(progress.data);
      setBookings(books.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const totalHours = completedBookings.length * 1.5;

  const chartData = progressData.map(p => ({
    date: new Date(p.recordDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    confidence: p.confidenceScore,
    hours: p.hoursCompleted,
    sessions: p.sessionsCompleted,
  }));

  const skillBreakdownData = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((acc, b) => {
      const skill = b.skillFocus;
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});

  const skillChartData = Object.entries(skillBreakdownData).map(([name, count]) => ({ name, count }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 shadow-xl">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}{entry.name === 'confidence' ? '%' : ''}</p>
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Progress Tracker</h1>
        <p className="text-slate-400 text-sm mt-1">Your complete driving journey analytics and growth charts.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Confidence Growth</p>
            <p className="text-3xl font-black text-white mt-1">
              {progressData.length >= 2
                ? `+${progressData[progressData.length - 1].confidenceScore - progressData[0].confidenceScore}%`
                : `${progressData[0]?.confidenceScore || 0}%`}
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Hours Practiced</p>
            <p className="text-3xl font-black text-white mt-1">{totalHours.toFixed(1)} hrs</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-400 rounded-2xl">
            <CheckSquare className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sessions Completed</p>
            <p className="text-3xl font-black text-white mt-1">{completedBookings.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Confidence Growth Line Chart */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-1">Confidence Score Over Time</h3>
        <p className="text-xs text-slate-500 mb-6">Track how your score evolves after each mentor session</p>
        {chartData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="confidence" name="Confidence Score" stroke="#3B82F6"
                  strokeWidth={2.5} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#06B6D4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
            Complete sessions to see your confidence growth chart.
          </div>
        )}
      </div>

      {/* Skills Practiced Bar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-1">Hours Practiced Over Time</h3>
          <p className="text-xs text-slate-500 mb-6">Cumulative practice hours recorded after each session</p>
          {chartData.length > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" />
                  <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="hours" name="Hours" stroke="#06B6D4"
                    strokeWidth={2.5} dot={{ fill: '#06B6D4', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
              No session data yet.
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-1">Skills Practiced Breakdown</h3>
          <p className="text-xs text-slate-500 mb-6">Sessions grouped by focus area</p>
          {skillChartData.length > 0 ? (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillChartData} layout="vertical">
                  <CartesianGrid stroke="#1E293B" strokeDasharray="4 4" />
                  <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Sessions" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
              Complete sessions to see skill breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Session History Table */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-5">Session History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Mentor</th>
                <th className="pb-3 pr-4">Focus</th>
                <th className="pb-3 pr-4">Time Slot</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {bookings.slice(0, 10).map(booking => (
                <tr key={booking.id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="py-3 pr-4 text-xs text-slate-300">{booking.date}</td>
                  <td className="py-3 pr-4 text-xs text-slate-300">{booking.mentor?.fullName || '—'}</td>
                  <td className="py-3 pr-4 text-xs text-slate-300">{booking.skillFocus}</td>
                  <td className="py-3 pr-4 text-xs text-slate-400">{booking.timeSlot}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      booking.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' :
                      booking.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-400' :
                      booking.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="text-center py-10 text-slate-600 text-sm">No sessions booked yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
