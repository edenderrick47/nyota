import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface LoanOption {
  amount: number;
  fee: number;
}

interface LoanSelectionProps {
  userName: string;
  onSelect: (option: LoanOption) => void;
  onBack: () => void;
}

const LOAN_OPTIONS: LoanOption[] = [
  { amount: 5500, fee: 100 },
  { amount: 6800, fee: 130 },
  { amount: 7800, fee: 170 },
  { amount: 9800, fee: 190 },
  { amount: 11200, fee: 230 },
  { amount: 16800, fee: 250 },
  { amount: 21200, fee: 270 },
  { amount: 25600, fee: 400 },
  { amount: 30000, fee: 470 },
  { amount: 35400, fee: 590 },
  { amount: 39800, fee: 730 },
  { amount: 44200, fee: 1010 },
  { amount: 48600, fee: 1600 },
  { amount: 60600, fee: 2050 },
];

export default function LoanSelection({ userName, onSelect, onBack }: LoanSelectionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border-l-4 border-l-brand-red">
        <p className="text-gray-700 font-medium">
          Hi <span className="font-bold text-gray-900">{userName}</span>, you qualify for these loan options based on your <span className="font-bold text-brand-dark">M-Pesa records</span> (2-month term at 10% interest).
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Select Your Loan Amount</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {LOAN_OPTIONS.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option)}
              className="bg-gray-50 border border-transparent hover:border-brand-red p-4 rounded-xl text-center transition-all group"
            >
              <div className="text-lg font-extrabold text-gray-900">Ksh {option.amount.toLocaleString()}</div>
              <div className="text-xs font-semibold text-gray-400 group-hover:text-brand-red transition-colors">Fee: Ksh {option.fee}</div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10">
          <button
            disabled
            className="w-full py-4 bg-gray-200 text-white rounded-2xl font-bold text-lg mb-6 cursor-not-allowed"
          >
            Get Loan Now →
          </button>
          
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
