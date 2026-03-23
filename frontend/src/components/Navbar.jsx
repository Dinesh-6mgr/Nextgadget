import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { fetchCart, clearCartLocal } from '../redux/slices/cartSlice';
import { ShoppingCart, User, Menu, Search, LogOut, LayoutDashboard } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { logoUrl, storeName } = useSelector((state) => state.settings);

  const logoSrc = logoUrl
    ? (logoUrl.startsWith('/uploads') ? `${BASE_URL}${logoUrl}` : logoUrl)
    : '/fulllogo.png';

  // Fetch cart from backend whenever user logs in
  useEffect(() => {
    if (userInfo && !userInfo.isAdmin) {
      dispatch(fetchCart());
    }
  }, [userInfo, dispatch]);

  const handleLogout = () => {
    dispatch(clearCartLocal());
    dispatch(logout());
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/5 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img 
              src={logoSrc}
              alt={storeName || 'Logo'}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold tracking-wider text-textMain hidden sm:block uppercase">
              {storeName ? storeName.toUpperCase() : 'NEXT'}<span className="text-secondary">{storeName ? '' : 'GADGET'}</span>
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={submitHandler} className="relative group">
              <input
                type="text"
                placeholder="Search premium gadgets..."
                className="w-full bg-[#151B28] border border-white/10 text-textMain rounded-full py-2.5 px-11 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-textSecondary/50 font-bold text-sm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="absolute left-4 top-3 h-5 w-5 text-textSecondary group-focus-within:text-accent transition-colors" />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative p-2 text-textSecondary hover:text-secondary transition-colors group">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center text-white ring-2 ring-dark shadow-glow">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="flex items-center gap-4">
                {userInfo.isAdmin && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-2 bg-[#151B28] hover:bg-[#1E2535] border border-white/10 px-4 py-2 rounded-lg text-textSecondary hover:text-textMain transition-all active:scale-95"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                  </Link>
                )}

                <Link to="/profile" className="flex items-center gap-2 hover:text-secondary transition-all group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-secondary transition-all">
                    <User className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-textMain hidden sm:block">
                    {userInfo.name.split(' ')[0]}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-lg text-red-500 transition-all active:scale-95"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-[#151B28] hover:bg-[#1E2535] border border-white/10 px-4 py-2 rounded-lg text-textSecondary hover:text-textMain transition-all active:scale-95 group">
                <User className="h-5 w-5 group-hover:text-secondary transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2 text-textSecondary">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
