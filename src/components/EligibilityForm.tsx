import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, UserCheck, Zap, Phone, User, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FormData {
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  loanType: string;
}

interface EligibilityFormProps {
  onEligible: (data: FormData) => void;
}

export default function EligibilityForm({ onEligible }: EligibilityFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    idNumber: '',
    loanType: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.idNumber || !formData.loanType) {
      setError('Please fill in all fields');
      return;
    }
    
    // Simple phone validation for Safaricom (07/01xxxxxxxx)
    const phoneRegex = /^(07|01)\d{8}$|^254(7|1)\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace('+', ''))) {
      setError('Invalid Phone: Please enter a valid Safaricom number (07xxxxxxxx)');
      return;
    }

    onEligible(formData);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-8">
      <div className="p-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Nyota <span className="text-brand-green">Youth</span> <span className="text-brand-red">Empowerment</span>
        </h1>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Check Your Loan Eligibility</h2>
        <p className="text-gray-500 font-medium">Find out how much you qualify for instantly</p>
        <div className="mt-4 text-brand-red font-black text-2xl uppercase tracking-tighter">
          Ksh. 1,500 – 60,000
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
        <div className="relative">
          <label className="text-xs font-bold text-brand-red uppercase ml-4 mb-1 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="John Kenya"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-bold text-brand-red uppercase ml-4 mb-1 block">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              placeholder="0712345678"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-bold text-brand-red uppercase ml-4 mb-1 block">ID Number</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="31555554"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-xs font-bold text-brand-red uppercase ml-4 mb-1 block">Select Loan Type</label>
          <select
            className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red transition-all outline-none text-gray-900 font-medium appearance-none"
            value={formData.loanType}
            onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
          >
            <option value="">Select Loan Type</option>
            <option value="Business">Business Loan</option>
            <option value="Personal">Personal Loan</option>
            <option value="Education">Education Loan</option>
            <option value="Medical">Medical Loan</option>
            <option value="Emergency">Emergency Loan</option>
          </select>
        </div>

        <div className="flex flex-wrap justify-center gap-3 py-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-brand-green rounded-full text-[10px] font-bold uppercase ring-1 ring-green-100">
            <ShieldCheck size={14} /> Secure Application
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-brand-green rounded-full text-[10px] font-bold uppercase ring-1 ring-green-100">
            <UserCheck size={14} /> No CRB Check
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-brand-green rounded-full text-[10px] font-bold uppercase ring-1 ring-green-100">
            <Zap size={14} /> Instant Approval
          </div>
        </div>

        <button
          className="w-full py-4 text-white font-bold rounded-full flex items-center justify-center gap-2 button-gradient shadow-lg shadow-brand-red/20 active:scale-95 transition-all text-lg"
        >
          CHECK ELIGIBILITY <ChevronRight size={20} />
        </button>

        <p className="text-center text-[10px] text-gray-400 font-medium">No paperwork required. No guarantors needed.</p>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          >
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center border-4 border-red-500">
                   <div className="text-red-500 text-6xl font-light leading-none">×</div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Invalid Phone</h3>
              <p className="text-gray-500 mb-6 font-medium">Please enter a valid Safaricom number (07xxxxxxxx)</p>
              <button
                onClick={() => setError(null)}
                className="w-24 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
