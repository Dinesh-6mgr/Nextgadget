import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// User Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Shop from './pages/Shop';

// Admin
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import AdminProductList from './pages/Admin/AdminProductList';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminCarts from './pages/Admin/AdminCarts';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminSettings from './pages/Admin/AdminSettings';

// Guard: redirect non-admins away from /admin/*
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((s) => s.auth);
  if (!userInfo) return <Navigate to="/login" replace />;
  if (!userInfo.isAdmin) return <Navigate to="/" replace />;
  return children;
};

const UserLayout = ({ children }) => (
  <div className="min-h-screen bg-dark text-textMain font-sans">
    <Navbar />
    <main>{children}</main>
    <footer className="bg-[#0A0F1C] border-t border-white/5 py-16 px-4 mt-20">
      <div className="text-center text-xs text-textSecondary">
        © 2026 NextGadget. All rights reserved.
      </div>
    </footer>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>

        {/* ── ADMIN ROUTES ── */}
        <Route path="/admin" element={
          <AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>
        } />
        <Route path="/admin/products" element={
          <AdminRoute><AdminLayout><AdminProductList /></AdminLayout></AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute><AdminLayout><AdminOrders /></AdminLayout></AdminRoute>
        } />
        <Route path="/admin/carts" element={
          <AdminRoute><AdminLayout><AdminCarts /></AdminLayout></AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>
        } />
        <Route path="/admin/settings" element={
          <AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>
        } />

        {/* ── USER ROUTES ── */}
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/shop" element={<UserLayout><Shop /></UserLayout>} />
        <Route path="/page/:pageNumber" element={<UserLayout><Shop /></UserLayout>} />
        <Route path="/search/:keyword" element={<UserLayout><Shop /></UserLayout>} />
        <Route path="/search/:keyword/page/:pageNumber" element={<UserLayout><Shop /></UserLayout>} />
        <Route path="/category/:category" element={<UserLayout><Shop /></UserLayout>} />
        <Route path="/category/:category/page/:pageNumber" element={<UserLayout><Shop /></UserLayout>} />
        <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
        <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
        <Route path="/product/:id" element={<UserLayout><ProductDetails /></UserLayout>} />
        <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
        <Route path="/shipping" element={<UserLayout><Shipping /></UserLayout>} />
        <Route path="/payment" element={<UserLayout><Payment /></UserLayout>} />
        <Route path="/placeorder" element={<UserLayout><PlaceOrder /></UserLayout>} />
        <Route path="/order/:id" element={<UserLayout><OrderDetails /></UserLayout>} />
        <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
