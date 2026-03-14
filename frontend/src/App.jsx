import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminProductList from './pages/AdminProductList';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-textMain antialiased font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/page/:pageNumber" element={<Shop />} />
            <Route path="/search/:keyword" element={<Shop />} />
            <Route path="/search/:keyword/page/:pageNumber" element={<Shop />} />
            <Route path="/category/:category" element={<Shop />} />
            <Route path="/category/:category/page/:pageNumber" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/productlist" element={<AdminProductList />} />
            <Route path="/admin/productlist/:pageNumber" element={<AdminProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-[#0A0F1C] border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 text-center md:text-left">
            <div className="md:col-span-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
                 <img src="/fulllogo.png" alt="Logo" className="h-10" />
                 <span className="text-3xl font-black tracking-tighter uppercase text-textMain">NEXT<span className="text-secondary">GADGET</span></span>
              </div>
              <p className="text-textSecondary max-w-sm mb-10 leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2 bg-primary/5">
                Premium technology and futuristic gadgets for the modern digital professional. Experience the peak of performance and innovation.
              </p>
            </div>
            <div>
              <h4 className="font-black text-textMain mb-8 tracking-[0.2em] uppercase text-xs">Explore System</h4>
              <ul className="space-y-5 text-textSecondary text-sm font-bold tracking-tight">
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">New Arrivals</a></li>
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Collections</a></li>
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Flash Sale</a></li>
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Bestsellers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-textMain mb-8 tracking-[0.2em] uppercase text-xs">Support Link</h4>
              <ul className="space-y-5 text-textSecondary text-sm font-bold tracking-tight">
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Help Center</a></li>
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Shipping Protocol</a></li>
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Returns & Warranty</a></li>
                <li><a href="#" className="hover:text-secondary transition-all hover:translate-x-1 inline-block">Contact HQ</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-textSecondary uppercase tracking-[0.4em] font-black opacity-30">
            &copy; 2026 NextGadget. All rights reserved. Designed for the Future.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
