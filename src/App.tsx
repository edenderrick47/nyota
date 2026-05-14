import { useState } from 'react';
import EligibilityForm from './components/EligibilityForm';
import LoanSelection from './components/LoanSelection';
import CheckoutModal from './components/CheckoutModal';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

type Step = 'eligibility' | 'selection' | 'success';

interface UserData {
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  loanType: string;
}

interface LoanOption {
  amount: number;
  fee: number;
}

export default function App() {
  const [step, setStep] = useState<Step>('eligibility');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleEligible = (data: UserData) => {
    setUserData(data);
    setStep('selection');
  };

  const handleLoanSelect = (option: LoanOption) => {
    setSelectedLoan(option);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-12 font-sans selection:bg-brand-red selection:text-white">
      {/* Header Decoration */}
      <div className="h-2 gradient-header w-full" />

      <main className="container mx-auto px-4 pt-12">
        <AnimatePresence mode="wait">
          {step === 'eligibility' && (
            <motion.div
              key="eligibility"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <EligibilityForm onEligible={handleEligible} />
            </motion.div>
          )}

          {step === 'selection' && userData && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <LoanSelection
                userName={userData.fullName}
                onSelect={handleLoanSelect}
                onBack={() => setStep('eligibility')}
              />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-white rounded-[3rem] p-12 text-center shadow-2xl mt-12 border-t-8 border-brand-green"
            >
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center pulse-animation">
                  <CheckCircle2 size={64} className="text-brand-green" />
                </div>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">Payment Initiated!</h2>
              <p className="text-gray-500 font-medium text-lg mb-8">
                Please check your phone for the M-Pesa prompt and enter your PIN to complete the loan processing.
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex items-center gap-3 text-brand-green">
                  <ShieldCheck size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">Secure Transaction</span>
                </div>
                <div className="flex items-center gap-3 text-brand-green">
                  <Zap size={20} />
                  <span className="text-sm font-bold uppercase tracking-wider">Fast Disbursement</span>
                </div>
              </div>
              <button
                onClick={() => setStep('eligibility')}
                className="w-full py-4 text-white font-bold rounded-full button-gradient shadow-xl text-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 w-full p-4 flex justify-center items-center gap-8 bg-white/50 backdrop-blur-sm">
         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Nyota © 2026</p>
      </footer>

      {showCheckout && selectedLoan && userData && (
        <CheckoutModal
          option={selectedLoan}
          phoneNumber={userData.phoneNumber}
          onClose={() => setShowCheckout(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-animation {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
