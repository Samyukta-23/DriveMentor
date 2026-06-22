import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Award, Languages, Car, ChevronDown, X, Filter } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const CITIES = ["All", "Bengaluru", "Chennai", "Coimbatore", "Madurai", "Hyderabad", "Mumbai", "Delhi", "Pune", "Kochi", "Ahmedabad"];
const VEHICLE_TYPES = ["All", "Manual", "Automatic"];
const LANGUAGES_LIST = ["All", "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Gujarati"];

const Marketplace = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedVehicle, setSelectedVehicle] = useState('All');
  const [selectedLang, setSelectedLang] = useState('All');
  const [minExperience, setMinExperience] = useState('');
  const [minRating, setMinRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    fetchMentors();
  }, [selectedCity, selectedVehicle, selectedLang, minExperience, minRating]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCity !== 'All') params.city = selectedCity;
      if (selectedVehicle !== 'All') params.vehicleType = selectedVehicle;
      if (selectedLang !== 'All') params.language = selectedLang;
      if (minExperience) params.minExperience = parseInt(minExperience);
      if (minRating) params.minRating = parseFloat(minRating);
      if (searchQuery) params.searchQuery = searchQuery;
      
      const response = await API.get('/api/mentors', { params });
      setMentors(response.data);
    } catch (err) {
      console.error("Error fetching mentors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMentors();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Find Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Perfect Mentor</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Browse verified driving coaches across 10+ Indian cities, filtered by your language and vehicle preference.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="glass-card p-5 rounded-3xl space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search mentor by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors glow-blue text-sm">
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 border border-slate-700 hover:border-slate-600 text-slate-300 px-4 py-3 rounded-xl text-sm transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </form>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2 border-t border-slate-800/80"
          >
            {/* City Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">City</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none transition-colors">
                {CITIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
              </select>
            </div>

            {/* Vehicle Type Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Type</label>
              <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none transition-colors">
                {VEHICLE_TYPES.map(v => <option key={v} value={v} className="bg-slate-900">{v}</option>)}
              </select>
            </div>

            {/* Language Filter */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Language</label>
              <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 appearance-none transition-colors">
                {LANGUAGES_LIST.map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
              </select>
            </div>

            {/* Min Experience */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min. Experience</label>
              <input type="number" min="1" max="30" placeholder="e.g. 5" value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Min Rating */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Min. Rating</label>
              <input type="number" min="1" max="5" step="0.1" placeholder="e.g. 4.5" value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Result Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">
          <span className="font-bold text-white">{mentors.length}</span> mentors found
          {selectedCity !== 'All' ? ` in ${selectedCity}` : ' across India'}
        </p>
      </div>

      {/* Mentor Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
        </div>
      ) : mentors.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <Search className="w-12 h-12 text-slate-700 mx-auto" />
          <h3 className="text-slate-300 font-bold text-lg">No Mentors Found</h3>
          <p className="text-slate-500 text-sm">Try clearing filters or choosing a different city.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <MentorCard mentor={mentor} onBook={() => setSelectedMentor(mentor)} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedMentor && (
        <BookingModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onSuccess={() => {
            setSelectedMentor(null);
          }}
        />
      )}
    </div>
  );
};

const MentorCard = ({ mentor, onBook }) => {
  const stars = Math.round(mentor.rating || 5);
  return (
    <div className="glass-card p-6 rounded-3xl hover:border-blue-500/30 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-full">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={mentor.user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentor.user.fullName}`}
              alt={mentor.user.fullName}
              className="w-14 h-14 rounded-2xl border border-slate-700 object-cover bg-slate-800"
            />
            {mentor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">✓</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{mentor.user.fullName}</h3>
            <div className="flex items-center space-x-1 text-slate-400 text-xs mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{mentor.user.city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-orange-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold text-white">{(mentor.rating || 5).toFixed(1)}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
        {mentor.bio}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center space-x-1 bg-slate-900/60 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-medium">
          <Award className="w-3 h-3 text-blue-400" />
          <span>{mentor.experienceYears} yrs exp.</span>
        </span>
        <span className="flex items-center space-x-1 bg-slate-900/60 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-medium">
          <Car className="w-3 h-3 text-cyan-400" />
          <span>{mentor.vehicleTypes}</span>
        </span>
        <span className="flex items-center space-x-1 bg-slate-900/60 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-medium">
          <Languages className="w-3 h-3 text-green-400" />
          <span className="truncate max-w-[80px]">{mentor.languages}</span>
        </span>
      </div>

      {/* Price + Book Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div>
          <span className="text-xl font-extrabold text-white">₹{mentor.hourlyRate}</span>
          <span className="text-xs text-slate-500"> / session</span>
        </div>
        <button
          onClick={onBook}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all glow-blue"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
