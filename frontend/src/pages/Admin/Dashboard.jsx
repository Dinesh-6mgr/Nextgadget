import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../api';
import { Users, Package, ClipboardList, DollarSign, ShoppingCart, TrendingUp, Loader2, ArrowRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, to }) => (
  <Link to={to} className="group bg-[#0A0F1C] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-primary/30 transition-all hover:shadow-glow">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon className="h-7 w-7 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-textMain tracking-tighter">{value}</p>
    </div>
    <ArrowRight className="h-5 w-5 text-textSecondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const symbol = useSelector((s) => s.settings.currencySymbol) || '$';

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: s }, { data: o }] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/orders'),
        ]);
        setStats(s);
        setRecentOrders(o.slice(0, 5));
      } catch (e) { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-12 w-12 text-secondary animate-spin" />
    </div>
  );

  const cards = [
    { label: 'Total Revenue', value: `${symbol}${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'bg-green-500/20', to: '/admin/orders' },
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ClipboardList, color: 'bg-blue-500/20', to: '/admin/orders' },
    { label: 'Pending Delivery', value: stats?.pendingOrders ?? 0, icon: TrendingUp, color: 'bg-yellow-500/20', to: '/admin/orders' },
    { label: 'Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-purple-500/20', to: '/admin/products' },
    { label: 'Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-pink-500/20', to: '/admin/users' },
    { label: 'Active Carts', value: '—', icon: ShoppingCart, color: 'bg-accent/20', to: '/admin/carts' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-textMain mb-1">Dashboard</h1>
        <p className="text-textSecondary text-sm">Welcome back, here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="font-black uppercase tracking-widest text-sm text-textMain">Recent Orders</h2>
          <Link to="/admin/orders" className="text-[10px] font-black text-secondary hover:text-accent uppercase tracking-widest transition-colors">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-textSecondary uppercase text-[10px] tracking-widest bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Paid</th>
                <th className="px-6 py-3 text-left">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
                  onClick={() => window.location.href = `/order/${order._id}`}>
                  <td className="px-6 py-4 text-xs text-textSecondary font-bold">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4 font-bold text-textMain">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-black text-accent">{symbol}{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${order.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${order.isDelivered ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {order.isDelivered ? 'Done' : 'Pending'}
                    </span>
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

export default Dashboard;
