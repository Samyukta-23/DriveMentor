import React from 'react';
import { motion } from 'framer-motion';

const Speedometer = ({ score = 50 }) => {
  // Map score (0 - 100) to rotation angle (-90 deg to 90 deg)
  const angle = -90 + (score / 100) * 180;

  // Get color based on score
  const getGlowColor = () => {
    if (score < 50) return 'rgba(239, 68, 68, 0.4)'; // Red glow for low confidence
    if (score < 75) return 'rgba(59, 130, 246, 0.4)'; // Blue glow for medium confidence
    return 'rgba(6, 182, 212, 0.5)'; // Cyan/Neon glow for high confidence
  };

  const getTextColor = () => {
    if (score < 50) return 'text-red-400';
    if (score < 75) return 'text-blue-400';
    return 'text-cyan-400';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-md relative overflow-hidden h-72">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${getGlowColor()} 0%, rgba(15,23,42,0) 70%)`
        }}
      />

      <div className="relative w-64 h-36 flex items-end justify-center">
        {/* Speedometer Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Background Track */}
          <path
            d="M 20,90 A 80,80 0 0,1 180,90"
            fill="none"
            stroke="#1E293B"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Active Color Track */}
          <path
            d="M 20,90 A 80,80 0 0,1 180,90"
            fill="none"
            stroke="url(#speedometerGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Defs for Arc Gradient */}
          <defs>
            <linearGradient id="speedometerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" /> {/* Red */}
              <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
              <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan */}
            </linearGradient>
          </defs>

          {/* Speedometer Ticks */}
          {[0, 20, 40, 60, 80, 100].map((tick, index) => {
            const tickAngle = -180 + (tick / 100) * 180;
            const rad = (tickAngle * Math.PI) / 180;
            const x1 = 100 + 72 * Math.cos(rad);
            const y1 = 90 + 72 * Math.sin(rad);
            const x2 = 100 + 78 * Math.cos(rad);
            const y2 = 90 + 78 * Math.sin(rad);
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#475569"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Animated Needle */}
        <motion.div
          className="absolute bottom-0 w-1.5 h-28 bg-gradient-to-t from-slate-400 to-cyan-400 rounded-full"
          style={{ 
            originX: 0.5, 
            originY: 1,
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'
          }}
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        />

        {/* Center Cap */}
        <div className="absolute bottom-0 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 glow-cyan flex items-center justify-center transform translate-y-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
        </div>
      </div>

      {/* Numeric Score */}
      <div className="text-center mt-6 z-10">
        <span className={`text-4xl font-extrabold tracking-tight glow-text-blue ${getTextColor()}`}>
          {score}%
        </span>
        <h4 className="text-xs text-slate-400 font-medium tracking-widest uppercase mt-1">
          Confidence Level
        </h4>
      </div>
    </div>
  );
};

export default Speedometer;
