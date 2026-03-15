import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, Package, MapPin, CreditCard, CheckCircle2, Truck, Info, Star, ShieldCheck, ShoppingCart, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const deliverHandler = async () => {
    try {
      const { data } = await api.put(`/orders/${id}/deliver`);
      setOrder(data);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <Loader2 className="h-16 w-16 text-secondary animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-32 px-4 bg-dark">
      <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center shadow-xl">
        <p className="font-black uppercase tracking-widest text-sm mb-2">Transmission Link Broken</p>
        <p className="text-textSecondary text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-4 uppercase tracking-tighter mb-2 text-textMain">
              <Package className="h-10 w-10 text-secondary" />
              Order ID: {order._id.substring(0, 10)}...
            </h1>
            <p className="text-textSecondary text-sm italic font-bold">Protocol initiated on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-4">
             {order.isPaid ? (
               <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-glow shadow-green-500/10">
                 <CheckCircle2 className="h-5 w-5" />
                 Transmission Secured (Paid)
               </div>
             ) : (
               <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest shadow-glow shadow-red-500/10">
                 <Clock className="h-5 w-5" />
                 Credits Pending
               </div>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
            {/* User Section */}
            <div className="card-dark p-10 border-white/5 relative overflow-hidden group">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <Info className="h-6 w-6 text-secondary" />
                User Intel
              </h2>
              <div className="flex items-center gap-6 p-6 bg-dark/50 rounded-2xl border border-white/5 relative z-10 hover:border-accent/20 transition-all">
                <div className="p-4 bg-accent/10 rounded-xl">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-textSecondary uppercase tracking-widest mb-1 font-bold opacity-50">Recipient Name</p>
                  <p className="text-lg font-black tracking-tight text-textMain">{order.user.name}</p>
                  <p className="text-sm text-textSecondary">{order.user.email}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:bg-accent/10 transition-colors" />
              </div>
            </div>

            {/* Logistics Section */}
            <div className="card-dark p-10 border-white/5 relative overflow-hidden group">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <Truck className="h-6 w-6 text-secondary" />
                Logistics Intel
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-6 bg-dark/50 p-6 rounded-2xl border border-white/5 relative z-10 hover:border-accent/20 transition-all">
                  <div className="p-4 bg-accent/10 rounded-xl">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-widest mb-2 font-bold opacity-50">Transmission Destination</p>
                    <p className="text-lg font-black tracking-tight text-textMain">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                    <p className="text-sm text-textSecondary">{order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:bg-accent/10 transition-colors" />
                </div>
                
                {order.isDelivered ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl flex items-center gap-4 font-black text-sm uppercase tracking-widest">
                    <CheckCircle2 className="h-6 w-6" />
                    Delivered on {new Date(order.deliveredAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-4 font-black text-sm uppercase tracking-widest italic animate-pulse">
                    <Clock className="h-6 w-6" />
                    Transmission in Transit (Not Delivered)
                  </div>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="card-dark p-10 border-white/5 relative overflow-hidden group">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <CreditCard className="h-6 w-6 text-secondary" />
                Credits Protocol
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-dark/50 p-6 rounded-2xl border border-white/5 relative z-10 hover:border-accent/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-accent/10 rounded-xl">
                      <CreditCard className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-textSecondary uppercase tracking-widest mb-1 font-bold opacity-50">Transfer Protocol</p>
                      <p className="text-lg font-black tracking-tight uppercase text-textMain">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10 group-hover:bg-accent/10 transition-colors" />
                </div>

                {order.isPaid ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl flex items-center gap-4 font-black text-sm uppercase tracking-widest">
                    <CheckCircle2 className="h-6 w-6" />
                    Credits Transferred on {new Date(order.paidAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-4 font-black text-sm uppercase tracking-widest italic animate-pulse">
                    <Clock className="h-6 w-6" />
                    Awaiting Credit Transmission
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Items */}
            <div className="card-dark p-10 border-white/5">
              <h2 className="text-xl font-black mb-8 flex items-center gap-4 uppercase tracking-tighter text-textMain">
                <ShoppingCart className="h-6 w-6 text-secondary" />
                Inventory Summary
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="font-bold hover:text-secondary transition-colors uppercase tracking-tight text-sm text-textMain">
                        {item.name}
                      </Link>
                      <p className="text-xs text-textSecondary font-bold italic">High-Performance Hardware</p>
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
                Grand Summary
              </h3>
              
              <div className="space-y-6 mb-12 text-sm">
                <div className="flex justify-between items-center group">
                  <span className="text-textSecondary font-bold uppercase tracking-widest text-[10px]">Net Credits</span>
                  <span className="font-black text-textMain">${order.itemsPrice}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textSecondary font-bold uppercase tracking-widest text-[10px]">Logistics Fee</span>
                  <span className={`font-black ${Number(order.shippingPrice) === 0 ? 'text-green-400' : 'text-textMain'}`}>
                    {Number(order.shippingPrice) === 0 ? 'FREE' : `$${order.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between items-center group">
                  <span className="text-textSecondary font-bold uppercase tracking-widest text-[10px]">Tax Allocation</span>
                  <span className="font-black text-textMain">${order.taxPrice}</span>
                </div>
                
                <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-black uppercase tracking-tighter text-textMain">Grand Total</span>
                    <span className="text-4xl font-black text-secondary tracking-tighter">${order.totalPrice}</span>
                  </div>
                </div>
              </div>

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <button 
                  onClick={deliverHandler}
                  className="w-full bg-secondary hover:bg-accent text-dark py-6 rounded-2xl font-black text-xl tracking-widest transition-all shadow-glow flex items-center justify-center gap-4 group active:scale-95 mb-4"
                >
                  MARK AS DELIVERED
                  <Truck className="h-7 w-7 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <div className="mt-8 flex items-center gap-3 justify-center text-[10px] font-black text-textSecondary/40 uppercase tracking-[0.3em]">
                <ShieldCheck className="h-4 w-4" />
                Quantum Transmission Secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
