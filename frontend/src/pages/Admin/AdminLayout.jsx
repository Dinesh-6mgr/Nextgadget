import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, ClipboardList,
  LogOut, Menu, X, ChevronRight, Settings,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { clearCartLocal } from '../../redux/slices/cartSlice';

const NAV = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Products', path: '/admin/products', icon: Package },
  { label: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { label: 'User Carts', path: '/admin/carts', icon: ShoppingCart },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children }) => {
  const { userInfo } = useSelector((s) => s.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearCartLocal());
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#070B14] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0F1C] border-r border-white/5 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <img src="/fulllogo.png" alt="logo" className="h-8 w-auto" />
            <span className="text-sm font-black uppercase tracking-widest text-textMain">
              NEXT<span className="text-secondary">GADGET</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-textSecondary hover:text-textMain">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-black text-primary uppercase">
                {userInfo?.name?.[0]}
              </span>
            </div>
            <div>
              <p className="text-xs font-black text-textMain truncate">{userInfo?.name}</p>
              <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Administrator</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all group
                ${isActive(path)
                  ? 'bg-primary text-white shadow-glow'
                  : 'text-textSecondary hover:bg-white/5 hover:text-textMain'}`}>
              <Icon className="h-5 w-5 flex-shrink-0" />
              {label}
              {isActive(path) && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-sm transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-textSecondary hover:text-textMain">
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-textSecondary uppercase tracking-widest font-bold">
              {NAV.find((n) => isActive(n.path))?.label || 'Admin'}
            </p>
          </div>
          <Link to="/" className="text-[10px] font-black text-textSecondary hover:text-secondary uppercase tracking-widest transition-colors">
            ← View Store
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
