import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

interface LoanOption {
  amount: number;
  fee: number;
}

interface CheckoutModalProps {
  option: LoanOption;
  phoneNumber: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ option, phoneNumber, onClose, onSuccess }: CheckoutModalProps) {
  const [phone, setPhone] = useState(phoneNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceed = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/stk-push', {
        phoneNumber: phone,
        amount: option.fee
      });
      console.log('STK Response:', response.data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.details || 'Failed to initiate payment. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const totalRepayment = option.amount * 1.1; // 10% interest

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        <div className="gradient-header p-8 text-center text-white relative">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Check className="text-brand-red" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">Confirm Loan</h2>
          <p className="text-xs font-medium text-white/80 uppercase">Review details before payment</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Loan Amount:</span>
              <span className="text-gray-900 font-extrabold text-base">Ksh {option.amount.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-50" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Processing Fee:</span>
              <span className="text-gray-900 font-extrabold text-base">Ksh {option.fee.toLocaleString()}</span>
            </div>
            <div className="h-px bg-gray-50" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Total Repayment:</span>
              <span className="text-gray-900 font-extrabold text-base">Ksh {totalRepayment.toLocaleString()}</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-red">
              <Phone size={18} />
            </div>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-brand-red/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-red outline-none text-brand-red font-bold text-center"
              placeholder="07xxxxxxxx"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleProceed}
              disabled={loading}
              className="w-full py-4 text-white font-bold rounded-2xl flex items-center justify-center gap-2 button-gradient group relative overflow-hidden disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Check size={20} /> Proceed
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-4 bg-blue-50/50 text-gray-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
