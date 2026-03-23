import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Loader2, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const symbol = useSelector((s) => s.settings.currencySymbol) || '$';

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/carts');
        setCarts(data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-10 w-10 text-secondary animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-textMain">User Carts</h1>
        <p className="text-textSecondary text-sm mt-1">{carts.length} active carts</p>
      </div>

      {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-4">{error}</p>}

      {carts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-textSecondary gap-3">
          <ShoppingCart className="h-12 w-12 opacity-20" />
          <p className="text-sm font-bold">No active carts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {carts.map((c) => (
            <div key={c.userId} className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all"
                onClick={() => setExpanded(expanded === c.userId ? null : c.userId)}>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="text-xs font-black text-primary uppercase">{c.userName?.[0]}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-textMain text-sm">{c.userName}</p>
                    <p className="text-[10px] text-textSecondary">{c.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] text-textSecondary uppercase tracking-widest font-bold">Items</p>
                    <p className="font-black text-textMain">{c.cart.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-textSecondary uppercase tracking-widest font-bold">Total</p>
                    <p className="font-black text-accent">{symbol}{c.total.toFixed(2)}</p>
                  </div>
                  {expanded === c.userId
                    ? <ChevronUp className="h-4 w-4 text-textSecondary" />
                    : <ChevronDown className="h-4 w-4 text-textSecondary" />}
                </div>
              </button>

              {expanded === c.userId && (
                <div className="border-t border-white/5">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-textSecondary uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-5 py-2 text-left">Image</th>
                        <th className="px-5 py-2 text-left">Product</th>
                        <th className="px-5 py-2 text-left">Price</th>
                        <th className="px-5 py-2 text-left">Qty</th>
                        <th className="px-5 py-2 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.cart.map((item, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-5 py-3">
                            {item.image
                              ? <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover border border-white/10" />
                              : <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10" />}
                          </td>
                          <td className="px-5 py-3 font-bold text-textMain max-w-[200px] truncate">{item.name}</td>
                          <td className="px-5 py-3 text-textSecondary font-bold">{symbol}{item.price}</td>
                          <td className="px-5 py-3 font-black text-textMain">{item.qty}</td>
                          <td className="px-5 py-3 font-black text-accent">{symbol}{(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCarts;
