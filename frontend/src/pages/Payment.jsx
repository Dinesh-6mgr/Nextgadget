import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { CreditCard, Wallet, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Banknote } from 'lucide-react';

const METHODS = [
  { id: 'Esewa',  label: 'Esewa',          desc: 'Pay via Esewa digital wallet',     icon: Wallet },
  { id: 'Khalti', label: 'Khalti',          desc: 'Pay via Khalti digital wallet',    icon: CreditCard },
  { id: 'COD',    label: 'Cash on Delivery', desc: 'Pay when your order arrives',     icon: Banknote },
];

const Payment = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { shippingAddress, paymentMethod: saved } = useSelector((s) => s.cart);
  const [paymentMethod, setPaymentMethod] = useState(saved || 'Esewa');

  useEffect(() => {
    if (!shippingAddress?.province && !shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full">

        {/* Progress */}
        <div className="flex items-center justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-black border border-green-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-glow">2</div>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Payment</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-dark border border-white/10 flex items-center justify-center text-textSecondary font-black">3</div>
            <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Summary</span>
          </div>
        </div>

        <div className="card-dark p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3 text-textMain">
              <CreditCard className="h-8 w-8 text-secondary" />
              Payment Method
            </h1>
            <p className="text-textSecondary text-sm italic">Choose how you'd like to pay</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-3">
              {METHODS.map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                    paymentMethod === id
                      ? 'bg-primary/10 border-primary shadow-glow'
                      : 'bg-dark/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl ${paymentMethod === id ? 'bg-primary/20' : 'bg-white/5'}`}>
                      <Icon className={`h-6 w-6 ${paymentMethod === id ? 'text-primary' : 'text-textSecondary'}`} />
                    </div>
                    <div>
                      <p className="font-black text-textMain uppercase tracking-tight">{label}</p>
                      <p className="text-xs text-textSecondary mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === id ? 'border-primary bg-primary' : 'border-white/20'
                  }`}>
                    {paymentMethod === id && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[10px] font-black text-textSecondary/50 uppercase tracking-[0.2em] justify-center">
              <ShieldCheck className="h-4 w-4" />
              Secure & Encrypted Transaction
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/shipping')}
                className="flex-1 bg-white/5 hover:bg-white/10 text-textSecondary py-4 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2 group font-black text-xs uppercase tracking-widest active:scale-95"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group tracking-widest uppercase active:scale-95"
              >
                Continue
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
