import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Compass, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'DRIVER') {
        navigate('/driver-dashboard');
      } else if (loggedUser.role === 'MENTOR') {
        navigate('/mentor-dashboard');
      } else if (loggedUser.role === 'ADMIN') {
        navigate('/admin-panel');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl glow-blue space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-2 text-cyan-400">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-sm text-slate-400">Resume your journey to road confidence</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required 
                placeholder="driver1@drivementor.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all duration-300 glow-blue text-sm mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register Here
          </Link>
        </div>

        <div className="border-t border-slate-800/80 pt-4 space-y-2 text-[10px] text-slate-500 text-center">
          <p className="font-semibold">Demo Credentials:</p>
          <p>Driver: <code className="text-cyan-400">driver1@drivementor.com</code> / <code className="text-cyan-400">password</code></p>
          <p>Mentor: <code className="text-cyan-400">mentor1@drivementor.com</code> / <code className="text-cyan-400">password</code></p>
          <p>Admin: <code className="text-cyan-400">admin@drivementor.com</code> / <code className="text-cyan-400">admin123</code></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
