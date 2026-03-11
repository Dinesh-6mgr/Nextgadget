import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { CreditCard, Wallet, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Payment = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
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
          <div className="flex flex-col items-center gap-2 group">
             <div className="w-10 h-10 rounded-full bg-dark border border-white/10 flex items-center justify-center text-textSecondary font-black group-hover:border-accent transition-all">3</div>
             <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest group-hover:text-accent transition-all">Summary</span>
          </div>
        </div>

        <div className="card-dark p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
          <div className="mb-10">
            <h1 className="text-3xl font-black mb-3 flex items-center gap-3 text-textMain">
              <CreditCard className="h-8 w-8 text-secondary" />
              Payment Mode
            </h1>
            <p className="text-textSecondary text-sm italic">How would you like to transfer your credits?</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-10">
            <div className="space-y-6">
              <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Select Gateway</label>
              
              <div className="grid grid-cols-1 gap-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PayPal')}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                    paymentMethod === 'PayPal' 
                      ? 'bg-primary/10 border-accent shadow-glow' 
                      : 'bg-dark/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-xl ${paymentMethod === 'PayPal' ? 'bg-accent/20' : 'bg-white/5'}`}>
                      <Wallet className={`h-8 w-8 ${paymentMethod === 'PayPal' ? 'text-accent' : 'text-textSecondary'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-black tracking-tight text-textMain uppercase">PayPal / Card</p>
                      <p className="text-xs text-textSecondary italic">Instant transmission and security</p>
                    </div>
                  </div>
                  {paymentMethod === 'PayPal' && <CheckCircle2 className="h-6 w-6 text-accent" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Stripe')}
                  className={`flex items-center justify-between p-6 rounded-2xl border transition-all text-left ${
                    paymentMethod === 'Stripe' 
                      ? 'bg-primary/10 border-accent shadow-glow' 
                      : 'bg-dark/50 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-xl ${paymentMethod === 'Stripe' ? 'bg-accent/20' : 'bg-white/5'}`}>
                      <CreditCard className={`h-8 w-8 ${paymentMethod === 'Stripe' ? 'text-accent' : 'text-textSecondary'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-black tracking-tight text-textMain uppercase">Direct Credit</p>
                      <p className="text-xs text-textSecondary italic">Secure stripe processing</p>
                    </div>
                  </div>
                  {paymentMethod === 'Stripe' && <CheckCircle2 className="h-6 w-6 text-accent" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 text-[10px] font-black text-textSecondary/50 uppercase tracking-[0.2em] justify-center italic">
                <ShieldCheck className="h-4 w-4" />
                Encrypted Transaction Layer Active
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/shipping')}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-textSecondary py-5 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2 group font-black text-xs uppercase tracking-widest active:scale-95"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  Abort Back
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group tracking-widest text-lg uppercase active:scale-95"
                >
                  Next Stage
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
