import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { Loader2, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const navigate = useNavigate();
  const symbol = useSelector((s) => s.settings.currencySymbol) || '$';

  const load = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markDelivered = async (e, id) => {
    e.stopPropagation();
    setUpdating(id);
    try {
      await api.put(`/orders/${id}/deliver`);
      await load();
    } catch (e) { setError(e.response?.data?.message || e.message); }
    setUpdating('');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-10 w-10 text-secondary animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-textMain">Orders</h1>
        <p className="text-textSecondary text-sm mt-1">{orders.length} total orders</p>
      </div>

      {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-4">{error}</p>}

      <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-textSecondary uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">User</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Paid</th>
                <th className="px-5 py-3 text-left">Delivered</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}
                  className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => navigate(`/order/${o._id}`)}>
                  <td className="px-5 py-4 text-xs text-textSecondary font-bold">#{o._id.slice(-6)}</td>
                  <td className="px-5 py-4 font-bold text-textMain">{o.user?.name || 'N/A'}</td>
                  <td className="px-5 py-4 text-xs text-textSecondary">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-black text-accent">{symbol}{o.totalPrice}</td>
                  <td className="px-5 py-4">
                    {o.isPaid
                      ? <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-green-500/10 text-green-400 uppercase tracking-widest w-fit">
                          <CheckCircle className="h-3 w-3" /> Paid
                        </span>
                      : <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-red-500/10 text-red-400 uppercase tracking-widest w-fit">
                          <DollarSign className="h-3 w-3" /> Unpaid
                        </span>}
                  </td>
                  <td className="px-5 py-4">
                    {o.isDelivered
                      ? <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-green-500/10 text-green-400 uppercase tracking-widest w-fit">
                          <CheckCircle className="h-3 w-3" /> Done
                        </span>
                      : <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 uppercase tracking-widest w-fit">
                          <Clock className="h-3 w-3" /> Pending
                        </span>}
                  </td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    {!o.isDelivered && (
                      <button
                        onClick={(e) => markDelivered(e, o._id)}
                        disabled={updating === o._id}
                        className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                        {updating === o._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                        Deliver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
