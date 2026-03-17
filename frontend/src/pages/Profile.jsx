import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../api';
import { User, Mail, Lock, Loader2, Package, ArrowRight, Clock, CheckCircle2, ShoppingBag, Settings, ShieldCheck, Phone } from 'lucide-react';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
    }

    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoadingOrders(false);
      } catch (error) {
        console.error(error);
        setLoadingOrders(false);
      }
    };
    fetchMyOrders();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        setUpdateLoading(true);
        const { data } = await api.put('/user/profile', {
          name,
          email,
          password,
          phone,
        });
        setUpdateLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
        setUpdateLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* User Info & Settings */}
          <div className="lg:w-1/3 space-y-8">
            <div className="card-dark p-8 border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors" />
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 mb-4 shadow-glow">
                  <div className="w-full h-full rounded-full bg-dark flex items-center justify-center text-textMain">
                    <User className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-1 text-textMain">{userInfo?.name}</h2>
                <p className="text-textSecondary text-xs uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                  {userInfo?.isAdmin ? <ShieldCheck className="h-4 w-4 text-accent" /> : null}
                  {userInfo?.isAdmin ? 'Authorized Admin' : 'Standard User'}
                </p>
              </div>

              {(message || success) && (
                <div className={`p-4 rounded-xl mb-8 text-sm text-center font-bold ${
                  success ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-500'
                }`}>
                  {message || 'Profile Updated Successfully'}
                </div>
              )}

              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full bg-dark border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <User className="absolute left-4 top-3 h-4 w-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Email Address</label>
                  <div className="relative group">
                    <input
                      type="email"
                      className="w-full bg-dark border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute left-4 top-3 h-4 w-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Phone Protocol</label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full bg-dark border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                    <Phone className="absolute left-4 top-3 h-4 w-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">New Security Key</label>
                  <div className="relative group">
                    <input
                      type="password"
                      className="w-full bg-dark border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain text-sm"
                      placeholder="Leave blank to keep current"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute left-4 top-3 h-4 w-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-3 ml-1">Confirm Security Key</label>
                  <div className="relative group">
                    <input
                      type="password"
                      className="w-full bg-dark border border-white/10 rounded-xl py-3 px-11 focus:outline-none focus:border-primary transition-all text-textMain text-sm"
                      placeholder="Confirm your new key"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Lock className="absolute left-4 top-3 h-4 w-4 text-textSecondary group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-glow flex items-center justify-center gap-2 uppercase tracking-widest text-xs active:scale-95"
                >
                  {updateLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sync Profile'}
                  {!updateLoading && <Settings className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:w-2/3">
            <div className="card-dark p-10 border-white/5 h-full">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 text-textMain">
                  <ShoppingBag className="h-8 w-8 text-secondary" />
                  Order Transmission History
                </h2>
                <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-secondary rounded-full hidden sm:block" />
              </div>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-textMain">
                  <Loader2 className="h-12 w-12 text-secondary animate-spin" />
                  <p className="text-[10px] font-black text-textSecondary uppercase tracking-[0.3em] animate-pulse">Scanning database...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/10 p-16 rounded-3xl text-center flex flex-col items-center">
                   <div className="bg-primary/10 p-4 rounded-full mb-6">
                     <Package className="h-10 w-10 text-secondary opacity-20" />
                   </div>
                   <h3 className="text-xl font-bold mb-2 text-textMain">No transmissions found</h3>
                   <p className="text-textSecondary text-sm mb-8 italic">You haven't initiated any gadget acquisitions yet.</p>
                   <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow">Start Browsing</Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-dark/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-accent/20 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 group-hover:bg-accent/10 transition-colors">
                          <Package className="h-6 w-6 text-textSecondary group-hover:text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1">Order ID: {order._id.substring(0, 10)}...</p>
                          <p className="text-lg font-black tracking-tight text-textMain">${order.totalPrice}</p>
                          <p className="text-xs text-textSecondary italic font-bold">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="flex flex-col gap-2 flex-1 sm:flex-initial">
                          {order.isPaid ? (
                            <span className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Paid
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                              <Clock className="h-3 w-3" /> Unpaid
                            </span>
                          )}
                          {order.isDelivered ? (
                            <span className="flex items-center gap-2 text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Delivered
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                              <Clock className="h-3 w-3" /> In Transit
                            </span>
                          )}
                        </div>
                        <Link to={`/order/${order._id}`} className="bg-[#151B28] hover:bg-[#1E2535] border border-white/10 p-3 rounded-xl text-textSecondary hover:text-textMain transition-all shadow-xl group/btn">
                          <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
