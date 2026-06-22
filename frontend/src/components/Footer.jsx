import React from 'react';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white font-extrabold text-xl">
            <Compass className="w-6 h-6 text-cyan-400" />
            <span>DriveMentor</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Connecting licensed but unconfident drivers with local, verified mentors. Master traffic, parking, and night driving safely.
          </p>
        </div>

        {/* Cities Covered */}
        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-widest mb-4">Cities Covered</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-slate-500">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Chennai</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Bengaluru</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Hyderabad</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Mumbai</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Pune</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Kochi</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Delhi</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Madurai</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-widest mb-4">Features</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Find a Mentor</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">AI Driving Insights</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Weekly Goal Tracker</li>
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Become a Mentor</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-widest mb-4">Contact Support</h4>
          <ul className="space-y-3 text-sm text-slate-500">
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>support@drivementor.in</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Bengaluru, Karnataka, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} DriveMentor Technologies Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
