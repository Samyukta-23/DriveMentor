import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Target, CreditCard, CheckCircle, XCircle, Loader, Shield } from 'lucide-react';
import API from '../services/api';

const SKILL_FOCUSES = [
  "City Driving", "Parking", "Reverse Parking", "Traffic Navigation",
  "Night Driving", "Highway Driving", "Rain Driving"
];

const TIME_SLOTS = [
  "07:00 AM - 08:30 AM", "09:00 AM - 10:30 AM",
  "11:00 AM - 12:30 PM", "03:00 PM - 04:30 PM",
  "05:00 PM - 06:30 PM", "07:00 PM - 08:30 PM"
];

const BookingModal = ({ mentor, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success/Fail
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [skillFocus, setSkillFocus] = useState(SKILL_FOCUSES[0]);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'success', 'failure'
  const [bookingId, setBookingId] = useState(null);

  const sessionCost = (mentor.hourlyRate * 1.5).toFixed(0);

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    if (!date) return;
    setStep(2);
  };

  const simulatePayment = async (shouldSucceed) => {
    setPaymentStatus('processing');

    // Simulate 1.8 second payment processing delay
    await new Promise(r => setTimeout(r, 1800));

    if (!shouldSucceed) {
      setPaymentStatus('failure');
      setStep(3);
      return;
    }

    try {
      const response = await API.post('/api/bookings', {
        mentorId: mentor.user.id,
        date,
        timeSlot,
        skillFocus,
        amountPaid: parseFloat(sessionCost),
      });
      setBookingId(response.data.id);
      setPaymentStatus('success');
      setStep(3);
    } catch (err) {
      console.error("Booking API failed:", err);
      setPaymentStatus('failure');
      setStep(3);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md glass-card rounded-3xl overflow-hidden glow-blue"
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-800/80">
            <div>
              <h2 className="text-lg font-extrabold text-white">
                {step === 1 ? 'Book Session' : step === 2 ? 'Secure Checkout' : paymentStatus === 'success' ? 'Booking Confirmed!' : 'Payment Failed'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {step === 1 && `With ${mentor.user.fullName} · ${mentor.user.city}`}
                {step === 2 && 'Complete your payment to confirm session'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: Session Details */}
          {step === 1 && (
            <form onSubmit={handleContinueToPayment} className="p-6 space-y-5">
              {/* Mentor Summary */}
              <div className="flex items-center space-x-4 p-4 bg-slate-950/60 rounded-2xl border border-slate-900">
                <img
                  src={mentor.user.profilePicture}
                  alt={mentor.user.fullName}
                  className="w-12 h-12 rounded-xl border border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-white text-sm">{mentor.user.fullName}</h3>
                  <p className="text-slate-400 text-xs">{mentor.experienceYears} yrs · {mentor.vehicleTypes}</p>
                </div>
                <div className="ml-auto text-right">
                  <span className="text-lg font-extrabold text-white">₹{mentor.hourlyRate}</span>
                  <p className="text-[10px] text-slate-500">/hour</p>
                </div>
              </div>

              {/* Date Picker */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" /><span>Session Date</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" /><span>Time Slot</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} type="button" onClick={() => setTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-[11px] font-semibold border transition-all text-left ${timeSlot === slot ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Focus */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <Target className="w-3.5 h-3.5" /><span>Focus Area</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_FOCUSES.map(skill => (
                    <button key={skill} type="button" onClick={() => setSkillFocus(skill)}
                      className={`py-1.5 px-3 rounded-full text-[11px] font-semibold border transition-all ${skillFocus === skill ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300' : 'border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all glow-blue text-sm">
                Continue to Payment →
              </button>
            </form>
          )}

          {/* STEP 2: Razorpay-Style Payment UI */}
          {step === 2 && (
            <div className="p-6 space-y-5">
              {/* Order Summary */}
              <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Summary</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{skillFocus} Session</span>
                  <span className="text-white font-bold">₹{sessionCost}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{date} · {timeSlot}</span>
                  <span>1.5 hours</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between">
                  <span className="font-bold text-white text-sm">Total Amount</span>
                  <span className="font-extrabold text-cyan-400 text-base">₹{sessionCost}</span>
                </div>
              </div>

              {/* Razorpay Branding Mock */}
              <div className="border border-blue-500/20 bg-blue-500/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">R</span>
                    </div>
                    <span className="text-xs font-bold text-slate-300">Razorpay Secure Checkout</span>
                  </div>
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-2 text-[10px] text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">●</span>
                    <span>Payments secured with 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">●</span>
                    <span>Supports UPI, Net Banking, Debit/Credit Cards</span>
                  </div>
                </div>
              </div>

              {/* Mock Card Input */}
              <div className="space-y-3">
                <div className="relative">
                  <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input type="text" placeholder="4111 1111 1111 1111 (Mock Card)" readOnly
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-400 cursor-default"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" readOnly
                    className="bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-400 cursor-default"
                  />
                  <input type="text" placeholder="CVV: 123" readOnly
                    className="bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-400 cursor-default"
                  />
                </div>
              </div>

              {paymentStatus === 'processing' ? (
                <div className="flex items-center justify-center space-x-3 py-4 bg-slate-950/60 rounded-xl">
                  <Loader className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span className="text-sm text-slate-300 font-medium">Processing payment securely...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => simulatePayment(true)}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm glow-green">
                    ✓ Pay ₹{sessionCost}
                  </button>
                  <button onClick={() => simulatePayment(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl transition-all text-sm text-xs">
                    Simulate Failure
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Result */}
          {step === 3 && (
            <div className="p-8 text-center space-y-5">
              {paymentStatus === 'success' ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto glow-green" />
                  </motion.div>
                  <h3 className="text-2xl font-extrabold text-white">Booking Confirmed!</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Your session with <strong className="text-white">{mentor.user.fullName}</strong> on{' '}
                    <strong className="text-white">{date}</strong> ({timeSlot}) for{' '}
                    <strong className="text-white">{skillFocus}</strong> has been requested successfully.
                    The mentor will accept shortly.
                  </p>
                  <button onClick={onSuccess}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all glow-blue text-sm">
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-red-400 mx-auto" />
                  <h3 className="text-2xl font-extrabold text-white">Payment Failed</h3>
                  <p className="text-slate-400 text-sm">
                    Your payment could not be processed. Please check your card details and try again.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setStep(2); setPaymentStatus(null); }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm">
                      Try Again
                    </button>
                    <button onClick={onClose}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm">
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
