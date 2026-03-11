import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCartItems } from '../redux/slices/cartSlice';
import api from '../utils/api';
import { MapPin, CreditCard, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, Truck, Package, Info } from 'lucide-react';

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;

  // Prices
  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = addDecimals(itemsPrice > 1000 ? 0 : 50);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const placeOrderHandler = async () => {
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems.map(item => ({
          ...item,
          product: item._id
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      dispatch(clearCartItems());
      navigate(`/order/${data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-16 relative px-4 max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full" />
          <div className="flex flex-col items-center gap-2">
             <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-black border border-green-500/20 shadow-glow shadow-green-500/10">
               <CheckCircle2 className="h-5 w-5" />
             </div>
             <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-black border border-green-500/20 shadow-glow shadow-green-500/10">
               <CheckCircle2 className="h-5 w-5" />
             </div>
             <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Payment</span>
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-glow animate-pulse">3</div>
             <span className="text-[10px] font-black text-primary uppercase tracking-widest">Summary</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
            {/* Logistics Section */}
            <div className="card-dark p-10 border-white/5">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <Truck className="h-6 w-6 text-secondary" />
                Logistics Confirmation
              </h2>
              <div className="flex items-start gap-6 bg-dark/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-accent/20 transition-all">
                <div className="p-4 bg-accent/10 rounded-xl">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-textSecondary uppercase tracking-widest mb-2 font-bold opacity-50">Transmission Destination</p>
                  <p className="text-lg font-black tracking-tight text-textMain">{shippingAddress.address}, {shippingAddress.city}</p>
                  <p className="text-sm text-textSecondary">{shippingAddress.postalCode}, {shippingAddress.country}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:bg-accent/10 transition-colors" />
              </div>
            </div>

            {/* Payment Section */}
            <div className="card-dark p-10 border-white/5">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <CreditCard className="h-6 w-6 text-secondary" />
                Credits Allocation
              </h2>
              <div className="flex items-center justify-between bg-dark/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-accent/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-accent/10 rounded-xl">
                    <CreditCard className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-widest mb-1 font-bold opacity-50">Transfer Protocol</p>
                    <p className="text-lg font-black tracking-tight uppercase text-textMain">{paymentMethod}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:bg-accent/10 transition-colors" />
              </div>
            </div>

            {/* Order Items */}
            <div className="card-dark p-10 border-white/5">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <Package className="h-6 w-6 text-secondary" />
                Inventory Summary
              </h2>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                    <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                      <Link to={`/product/${item._id}`} className="font-bold hover:text-secondary transition-colors uppercase tracking-tight text-sm text-textMain">
                        {item.name}
                      </Link>
                      <p className="text-xs text-textSecondary font-bold italic">{item.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-textSecondary">{item.qty} x ${item.price}</p>
                      <p className="font-black text-accent text-lg">${(item.qty * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout Info */}
          <div className="lg:col-span-1 sticky top-32">
            <div className="card-dark p-10 shadow-glow border-accent/20">
              <h3 className="text-xl font-black mb-10 pb-4 border-b border-white/5 uppercase tracking-widest flex items-center gap-2 text-textMain">
                <Info className="h-5 w-5 text-secondary" />
                Final Intel
              </h3>
              
              <div className="space-y-6 mb-12 text-sm">
                <div className="flex justify-between items-center group">
                  <span className="text-textSecondary font-bold uppercase tracking-widest text-[10px]">Net Credits</span>
                  <span className="font-black text-textMain">${itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textSecondary font-bold uppercase tracking-widest text-[10px]">Logistics Fee</span>
                  <span className={`font-black ${Number(shippingPrice) === 0 ? 'text-green-400' : 'text-textMain'}`}>
                    {Number(shippingPrice) === 0 ? 'FREE' : `$${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textSecondary font-bold uppercase tracking-widest text-[10px]">Tax Allocation</span>
                  <span className="font-black text-textMain">${taxPrice}</span>
                </div>
                
                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-black uppercase tracking-tighter text-textMain">Grand Total</span>
                    <span className="text-4xl font-black text-secondary tracking-tighter">${totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={placeOrderHandler}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-black text-xl tracking-widest transition-all shadow-glow flex items-center justify-center gap-4 group active:scale-95"
                >
                  INITIALIZE ORDER
                  <ArrowRight className="h-7 w-7 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/payment')}
                  className="w-full bg-white/5 hover:bg-white/10 text-textSecondary py-4 rounded-xl font-black text-[10px] tracking-[0.2em] uppercase transition-all border border-white/5 active:scale-95"
                >
                  Adjust Gateway
                </button>
              </div>

              <div className="mt-8 flex items-center gap-3 justify-center text-[10px] font-black text-textSecondary/40 uppercase tracking-[0.3em]">
                <ShieldCheck className="h-4 w-4" />
                Quantum Encryption Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
