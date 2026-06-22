import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star } from 'lucide-react';
import API from '../services/api';

const SKILL_LABELS = [
  { key: 'parkingScore', label: 'Parking Skills' },
  { key: 'trafficHandlingScore', label: 'Traffic Handling' },
  { key: 'highwayDrivingScore', label: 'Highway Driving' },
  { key: 'nightDrivingScore', label: 'Night Driving' },
  { key: 'roadAwarenessScore', label: 'Road Awareness' },
];

const STRENGTH_OPTIONS = ['Lane Discipline', 'Clutch Control', 'Mirror Checks', 'Smooth Braking', 'Highway Merging', 'Parallel Parking', 'Speed Judgment'];
const WEAKNESS_OPTIONS = ['Reverse Parking', 'Mirror Checks', 'Sudden Braking', 'High-beam Control', 'Lane Changing', 'Roundabout Navigation', 'Clutch Biting'];

const FeedbackSubmitModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [verbalFeedback, setVerbalFeedback] = useState('');
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [scores, setScores] = useState({
    parkingScore: 70,
    trafficHandlingScore: 70,
    highwayDrivingScore: 70,
    nightDrivingScore: 70,
    roadAwarenessScore: 70,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleItem = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/api/bookings/${booking.id}/feedback`, {
        rating,
        verbalFeedback,
        strengths,
        weaknesses,
        ...scores,
      });
      setSuccess(true);
      setTimeout(onSuccess, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-lg glass-card rounded-3xl overflow-hidden glow-cyan max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-800/80 sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
            <div>
              <h2 className="text-lg font-extrabold text-white">Submit Session Evaluation</h2>
              <p className="text-xs text-slate-400 mt-0.5">For {booking.driver?.fullName} · {booking.date}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <div className="p-12 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Feedback Submitted!</h3>
              <p className="text-slate-400 text-sm">AI recommendations have been generated for the driver.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                      <Star className={`w-7 h-7 transition-colors ${star <= rating ? 'text-orange-400 fill-current' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Verbal Feedback */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verbal Review</label>
                <textarea
                  required rows="3"
                  placeholder="Describe driver's performance, specific areas, and coach notes..."
                  value={verbalFeedback}
                  onChange={(e) => setVerbalFeedback(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none placeholder-slate-600"
                />
              </div>

              {/* Skill Score Sliders */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Individual Skill Scores (0-100)</label>
                {SKILL_LABELS.map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{label}</span>
                      <span className={`font-bold ${scores[key] >= 80 ? 'text-green-400' : scores[key] >= 60 ? 'text-blue-400' : 'text-red-400'}`}>
                        {scores[key]}
                      </span>
                    </div>
                    <input
                      type="range" min="0" max="100" step="5"
                      value={scores[key]}
                      onChange={(e) => setScores(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="w-full h-2 rounded-full cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Strengths */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver Strengths</label>
                <div className="flex flex-wrap gap-2">
                  {STRENGTH_OPTIONS.map(s => (
                    <button key={s} type="button"
                      onClick={() => toggleItem(strengths, setStrengths, s)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${strengths.includes(s) ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Areas Needing Improvement</label>
                <div className="flex flex-wrap gap-2">
                  {WEAKNESS_OPTIONS.map(w => (
                    <button key={w} type="button"
                      onClick={() => toggleItem(weaknesses, setWeaknesses, w)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${weaknesses.includes(w) ? 'bg-red-500/10 border-red-500/40 text-red-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-900 text-white font-bold py-3.5 rounded-xl transition-all glow-cyan text-sm"
              >
                {submitting ? 'Generating AI Recommendations...' : 'Submit Feedback & Generate AI Insights'}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackSubmitModal;
