import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, MapPin, Brain, BarChart3, Clock, Compass, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/register';
    if (user.role === 'DRIVER') return '/driver-dashboard';
    if (user.role === 'MENTOR') return '/mentor-dashboard';
    return '/admin-panel';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden px-6">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 filter brightness-50 contrast-125 scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop')" // Porsche on open highway
          }}
        />
        {/* Neon blue highway grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/85 to-transparent z-10" />

        <div className="max-w-5xl mx-auto text-center relative z-20 space-y-8 mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider glow-blue"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Launch Your Driving Journey In India</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white"
          >
            Drive With <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent glow-text-blue">Confidence</span>, <br />
            Not <span className="text-red-500 font-black">Fear</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Connect with experienced, hand-picked driving mentors to conquer parking, heavy traffic navigation, and night highways.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              to={getDashboardLink()} 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 glow-blue group"
            >
              <span>Find a Mentor</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/register?role=MENTOR" 
              className="w-full sm:w-auto border border-slate-700 hover:border-slate-500 hover:bg-slate-900/60 text-slate-300 font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center"
            >
              Become a Mentor
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 pt-12 max-w-3xl mx-auto border-t border-slate-800/80"
          >
            <div className="text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">5,000+</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1 block">Drivers Trained</span>
            </div>
            <div className="text-center border-x border-slate-900">
              <span className="block text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">1,200+</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1 block">Verified Mentors</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">50+</span>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1 block">Cities Covered</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Why DriveMentor Section */}
      <section className="py-24 bg-[#0F172A] px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Why DriveMentor?</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white">Engineered For Confident Driving</h3>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              We bridge the gap between getting a driving license and actually steering independently on complex Indian roads.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={itemVariants} className="glass-card p-8 rounded-3xl hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Shield className="w-6 h-6 text-blue-400 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">100% Verified Mentors</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every mentor undergoes manual background screening, RTO record audit, and vehicle safety verification before onboarding.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={itemVariants} className="glass-card p-8 rounded-3xl hover:border-cyan-500/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 transition-colors">
                <Brain className="w-6 h-6 text-cyan-400 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">AI Driving Insights</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receive structured evaluations after every session detailing strengths, weaknesses, and concrete practice suggestions.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={itemVariants} className="glass-card p-8 rounded-3xl hover:border-green-500/40 hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-400 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-100 mb-3">Progress Analytics</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Watch your confidence score rise and track completed hours using charts that log your milestone achievements.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. How It Works Timeline */}
      <section className="py-24 bg-slate-950 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">The Roadmap</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white">How DriveMentor Works</h3>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform md:-translate-x-1/2" />

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-blue-500 flex items-center justify-center transform md:-translate-x-1/2 z-10 font-bold text-sm text-blue-400">1</div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="text-lg font-bold text-white mb-2">Choose Mentor</h4>
                  <p className="text-slate-400 text-sm">Filter marketplace mentors in your city by experience, language, and vehicle type.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center transform md:-translate-x-1/2 z-10 font-bold text-sm text-cyan-400">2</div>
                <div className="hidden md:block md:w-1/2" />
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-12">
                  <h4 className="text-lg font-bold text-white mb-2">Book Session</h4>
                  <p className="text-slate-400 text-sm">Select dates, timings, and focus skills such as reverse parallel parking or night driving.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-green-500 flex items-center justify-center transform md:-translate-x-1/2 z-10 font-bold text-sm text-green-400">3</div>
                <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                  <h4 className="text-lg font-bold text-white mb-2">Practice Driving</h4>
                  <p className="text-slate-400 text-sm">Learn in real-world Indian traffic with your mentor guiding your clutch and brake controls.</p>
                </div>
                <div className="hidden md:block md:w-1/2" />
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-start md:items-center">
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center transform md:-translate-x-1/2 z-10 font-bold text-sm text-orange-400">4</div>
                <div className="hidden md:block md:w-1/2" />
                <div className="ml-12 md:ml-0 md:w-1/2 md:pl-12">
                  <h4 className="text-lg font-bold text-white mb-2">Get Feedback & Track Growth</h4>
                  <p className="text-slate-400 text-sm">Review scores and unlock dashboard achievement badges as your confidence gauge grows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section */}
      <section className="py-24 bg-[#0F172A] px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Testimonials</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white">Loved By Confident Indian Drivers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="glass-card p-8 rounded-3xl relative">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" 
                  alt="Priya" 
                  className="w-12 h-12 rounded-full border border-blue-500" 
                />
                <div>
                  <h4 className="text-base font-bold text-white">Priya Sharma</h4>
                  <span className="text-xs text-slate-500">Student • Chennai</span>
                </div>
              </div>
              <div className="flex space-x-1 text-orange-400 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "I held a driving license for 3 years but was too terrified to take the car out in Chennai traffic. After 4 sessions with Amit, I was able to drive to office independently! The confidence speedometer charts don't lie!"
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-8 rounded-3xl relative">
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" 
                  alt="Arjun" 
                  className="w-12 h-12 rounded-full border border-cyan-500" 
                />
                <div>
                  <h4 className="text-base font-bold text-white">Arjun Das</h4>
                  <span className="text-xs text-slate-500">Software Engineer • Bengaluru</span>
                </div>
              </div>
              <div className="flex space-x-1 text-orange-400 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "Parallel parking on crowded roads was my biggest nightmare. My mentor devendra explained the reference points so easily. The Razorpay booking flow and dashboards feel extremely premium and smooth."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
