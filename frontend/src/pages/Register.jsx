import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, MapPin, Compass, AlertCircle, Award, CreditCard, Languages, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'MENTOR' ? 'MENTOR' : 'DRIVER';

  // Form Fields
  const [role, setRole] = useState(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  // Driver Fields
  const [vehicleTypePreference, setVehicleTypePreference] = useState('BOTH');

  // Mentor Fields
  const [experienceYears, setExperienceYears] = useState(5);
  const [languages, setLanguages] = useState('English, Hindi');
  const [vehicleTypes, setVehicleTypes] = useState('Manual, Automatic');
  const [hourlyRate, setHourlyRate] = useState(500);
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cities = ["Bengaluru", "Chennai", "Coimbatore", "Madurai", "Hyderabad", "Mumbai", "Delhi", "Pune", "Kochi", "Ahmedabad"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      email,
      password,
      fullName,
      phone,
      role,
      city,
      licenseNumber,
      ...(role === 'DRIVER' ? { vehicleTypePreference } : { experienceYears, languages, vehicleTypes, hourlyRate, bio })
    };

    try {
      const registeredUser = await register(payload);
      if (registeredUser.role === 'DRIVER') {
        navigate('/driver-dashboard');
      } else if (registeredUser.role === 'MENTOR') {
        navigate('/mentor-dashboard');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl glass-card p-8 rounded-3xl glow-blue space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-2 text-cyan-400">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Join DriveMentor</h2>
          <p className="text-sm text-slate-400">Choose your path and register your account</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-4 p-1.5 bg-slate-950/60 rounded-xl border border-slate-900">
          <button
            type="button"
            onClick={() => setRole('DRIVER')}
            className={`py-3 rounded-lg text-sm font-bold transition-all ${role === 'DRIVER' ? 'bg-blue-600 text-white glow-blue' : 'text-slate-400 hover:text-slate-200'}`}
          >
            I am a Student Driver
          </button>
          <button
            type="button"
            onClick={() => setRole('MENTOR')}
            className={`py-3 rounded-lg text-sm font-bold transition-all ${role === 'MENTOR' ? 'bg-blue-600 text-white glow-blue' : 'text-slate-400 hover:text-slate-200'}`}
          >
            I want to Mentor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="text" required placeholder="Samyuktha Nair" value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="email" required placeholder="samyu@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="password" required placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="tel" required placeholder="9876543210" value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <select
                  value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  {cities.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                </select>
              </div>
            </div>

            {/* License Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Driving License Number</label>
              <div className="relative">
                <Shield className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input 
                  type="text" required placeholder="DL-1420110012345" value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Conditional Driver Layout */}
          {role === 'DRIVER' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 border-t border-slate-800/80 pt-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Preferred Transmission Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {['MANUAL', 'AUTOMATIC', 'BOTH'].map(pref => (
                  <button
                    key={pref} type="button" onClick={() => setVehicleTypePreference(pref)}
                    className={`py-3 border rounded-xl text-xs font-bold transition-all ${vehicleTypePreference === pref ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Conditional Mentor Layout */}
          {role === 'MENTOR' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 border-t border-slate-800/80 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Years of Teaching Experience</label>
                  <div className="relative">
                    <Award className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="number" required min="1" value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Hourly Pricing (INR)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="number" required min="100" step="50" value={hourlyRate}
                      onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Spoken Languages</label>
                  <div className="relative">
                    <Languages className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" required placeholder="English, Hindi, Tamil" value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Transmission Types Supported</label>
                  <input 
                    type="text" required placeholder="Manual, Automatic" value={vehicleTypes}
                    onChange={(e) => setVehicleTypes(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Short Biography</label>
                <textarea
                  required rows="3" placeholder="Tell new drivers about your coaching approach..." value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </motion.div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 glow-blue text-sm mt-4"
          >
            {loading ? 'Creating Account...' : 'Submit Application'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
