import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Speedometer from '../components/Speedometer';
import API from '../services/api';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Calendar, Clock, Award, Star, Compass, AlertCircle, ArrowRight, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const DriverDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get('/api/drivers/dashboard');
      setData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Compass className="w-12 h-12 text-cyan-400 animate-spin" />
          <span className="text-sm text-slate-400">Loading your profile dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 max-w-md border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Error</h3>
          <p className="text-sm text-slate-400">{error || 'Could not fetch dashboard metrics.'}</p>
          <button onClick={fetchDashboardData} className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Transform skills Map for Radar Chart
  const radarData = Object.entries(data.skills).map(([key, value]) => ({
    subject: key,
    A: value,
    fullMark: 100,
  }));

  const goalPercentage = Math.min(100, Math.round((data.hoursPracticed / data.weeklyGoalHours) * 100));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* 1. Header / Welcome Message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user.fullName}!</h1>
          <p className="text-slate-400 text-sm mt-1">
            {data.confidenceScore < 60 
              ? "Let's work on boosting your road awareness and traffic navigation this week."
              : "Excellent progress! Continue practicing your highway lane changes and parking control."
            }
          </p>
        </div>
        <Link 
          to="/marketplace" 
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-300 flex items-center space-x-2 glow-blue"
        >
          <span>Find a Mentor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 2. Top Stats Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Speedometer Confidence Score */}
        <Speedometer score={data.confidenceScore} />

        {/* Weekly Goal Progress */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between h-72 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Weekly Goals</h3>
              <span className="text-5xl font-black text-white mt-3 block">{data.hoursPracticed.toFixed(1)} <span className="text-lg font-medium text-slate-500">/ {data.weeklyGoalHours} hrs</span></span>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <Target className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-3 z-10">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Weekly Completion</span>
              <span>{goalPercentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-semibold pt-1">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Current Streak: {data.streakDays} Days</span>
            </div>
          </div>
        </div>

        {/* Next Scheduled Session */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between h-72 relative">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Next Session</h3>
              {data.nextSession ? (
                <span className="text-xl font-bold text-white mt-4 block leading-tight">
                  {data.nextSession.skillFocus}
                </span>
              ) : (
                <span className="text-sm text-slate-500 mt-4 block">No sessions booked.</span>
              )}
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {data.nextSession ? (
            <div className="space-y-4">
              <div className="space-y-2 border-l-2 border-cyan-500 pl-3">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{data.nextSession.date} • {data.nextSession.timeSlot}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Mentor: <span className="font-bold text-slate-200">{data.nextSession.mentor.fullName}</span>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${data.nextSession.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                {data.nextSession.status}
              </span>
            </div>
          ) : (
            <Link to="/marketplace" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1">
              <span>Browse mentors in your city</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* 3. Middle Section: Radar Skill Chart & Recent Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Driving Skill Breakdown</h3>
            <p className="text-xs text-slate-500 mb-6">Radar chart visualizes evaluations from your mentor</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Recent Mentor Feedback</h3>
            <p className="text-xs text-slate-500 mb-4">Evaluations from your completed sessions</p>
          </div>

          {data.recentFeedback ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={data.recentFeedback.mentor.profilePicture} alt="" className="w-9 h-9 rounded-full border border-blue-500/20" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">{data.recentFeedback.mentor.fullName}</h4>
                    <span className="text-[10px] text-slate-500">Session Date: {data.recentFeedback.booking.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-orange-400 bg-orange-500/5 px-2.5 py-1 rounded-full border border-orange-500/10">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold">{data.recentFeedback.rating}.0</span>
                </div>
              </div>

              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-900">
                <p className="text-slate-300 text-xs leading-relaxed">
                  "{data.recentFeedback.verbalFeedback}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest block mb-1.5">Strengths</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.recentFeedback.strengths.split(',').map((s, idx) => (
                      <span key={idx} className="bg-green-500/5 border border-green-500/15 text-green-400 px-2 py-0.5 rounded-md text-[10px] font-medium capitalize">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1.5">Weaknesses</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.recentFeedback.weaknesses.split(',').map((w, idx) => (
                      <span key={idx} className="bg-red-500/5 border border-red-500/15 text-red-400 px-2 py-0.5 rounded-md text-[10px] font-medium capitalize">
                        {w.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm py-16">
              Complete a mentorship session to receive feedback evaluations.
            </div>
          )}
        </div>
      </div>

      {/* 4. AI Driving Insights Recommendations */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="text-lg font-bold text-white mb-4">AI Driving Insights & recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.aiRecommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-950/40 border border-slate-900 rounded-2xl hover:border-slate-800 transition-colors">
              <div className="p-2 bg-blue-500/10 text-cyan-400 rounded-xl mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Achievement Badges */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Unlocked Achievements</h3>
            <p className="text-xs text-slate-500">Collect milestone badges by polishing your driving scores</p>
          </div>
          <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full font-semibold">
            {data.achievements.length} Badges Earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {/* Badge 1: First Drive */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center space-y-2 transition-all ${data.achievements.some(a => a.badgeName === 'First Drive') ? 'bg-blue-500/5 border-blue-500/30 text-blue-400 glow-blue' : 'bg-slate-900/10 border-slate-800/80 text-slate-600'}`}>
            <Award className="w-10 h-10" />
            <span className="text-xs font-bold">First Drive</span>
            <span className="text-[10px] text-slate-500">Completed 1 Session</span>
          </div>

          {/* Badge 2: Safe Driver */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center space-y-2 transition-all ${data.achievements.some(a => a.badgeName === 'Safe Driver') ? 'bg-cyan-500/5 border-cyan-500/30 text-cyan-400 glow-cyan' : 'bg-slate-900/10 border-slate-800/80 text-slate-600'}`}>
            <Award className="w-10 h-10" />
            <span className="text-xs font-bold">Safe Driver</span>
            <span className="text-[10px] text-slate-500">Confidence Score &ge; 80%</span>
          </div>

          {/* Badge 3: Parking Expert */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center space-y-2 transition-all ${data.achievements.some(a => a.badgeName === 'Parking Expert') ? 'bg-green-500/5 border-green-500/30 text-green-400 glow-green' : 'bg-slate-900/10 border-slate-800/80 text-slate-600'}`}>
            <Award className="w-10 h-10" />
            <span className="text-xs font-bold">Parking Expert</span>
            <span className="text-[10px] text-slate-500">Parking Score &ge; 85%</span>
          </div>

          {/* Badge 4: Traffic Warrior */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center space-y-2 transition-all ${data.achievements.some(a => a.badgeName === 'Traffic Warrior') ? 'bg-orange-500/5 border-orange-500/30 text-orange-400' : 'bg-slate-900/10 border-slate-800/80 text-slate-600'}`}>
            <Award className="w-10 h-10" />
            <span className="text-xs font-bold">Traffic Warrior</span>
            <span className="text-[10px] text-slate-500">Traffic Score &ge; 85%</span>
          </div>

          {/* Badge 5: Highway Hero */}
          <div className={`p-4 rounded-2xl border text-center flex flex-col items-center space-y-2 transition-all ${data.achievements.some(a => a.badgeName === 'Highway Hero') ? 'bg-indigo-500/5 border-indigo-500/30 text-indigo-400' : 'bg-slate-900/10 border-slate-800/80 text-slate-600'}`}>
            <Award className="w-10 h-10" />
            <span className="text-xs font-bold">Highway Hero</span>
            <span className="text-[10px] text-slate-500">Highway Score &ge; 85%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
