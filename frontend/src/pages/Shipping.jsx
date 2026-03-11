import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { MapPin, Globe, ArrowRight, Truck } from 'lucide-react';

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 relative px-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full" />
          <div className="flex flex-col items-center gap-2 group">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-glow">1</div>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
             <div className="w-10 h-10 rounded-full bg-dark border border-white/10 flex items-center justify-center text-textSecondary font-black group-hover:border-accent group-hover:text-accent transition-all">2</div>
             <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest group-hover:text-accent transition-all">Payment</span>
          </div>
          <div className="flex flex-col items-center gap-2 group">
             <div className="w-10 h-10 rounded-full bg-dark border border-white/10 flex items-center justify-center text-textSecondary font-black group-hover:border-accent group-hover:text-accent transition-all">3</div>
             <span className="text-[10px] font-black text-textSecondary uppercase tracking-widest group-hover:text-accent transition-all">Summary</span>
          </div>
        </div>

        <div className="card-dark p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
          <div className="mb-10">
            <h1 className="text-3xl font-black mb-3 flex items-center gap-3 text-textMain">
              <Truck className="h-8 w-8 text-secondary" />
              Shipping Intel
            </h1>
            <p className="text-textSecondary text-sm italic">Where should we transmit your new gadgets?</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Transmission Address</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl py-4 px-12 focus:outline-none focus:border-accent transition-all text-textMain group-hover:border-white/20"
                    placeholder="123 Galactic Way"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-textSecondary group-focus-within:text-accent transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Sector (City)</label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      className="w-full bg-dark border border-white/10 rounded-xl py-4 px-12 focus:outline-none focus:border-accent transition-all text-textMain group-hover:border-white/20"
                      placeholder="Neo Tokyo"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Globe className="absolute left-4 top-4 h-5 w-5 text-textSecondary group-focus-within:text-accent transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Grid Code (Zip)</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-dark border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-accent transition-all text-textMain hover:border-white/20"
                    placeholder="10101"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Federation (Country)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-dark border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-accent transition-all text-textMain hover:border-white/20"
                  placeholder="Planet Earth"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-2xl transition-all shadow-glow flex items-center justify-center gap-3 group tracking-widest text-lg uppercase active:scale-95"
            >
              Confirm Logistics
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
