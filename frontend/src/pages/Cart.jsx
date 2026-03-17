import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, addToCartAsync, removeFromCartAsync } from '../redux/slices/cartSlice';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, Minus, Plus, CreditCard, Loader2 } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, loading } = useSelector((state) => state.cart);
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/cart');
      return;
    }
    // Only fetch from backend if local state is empty (e.g. fresh page load)
    if (cartItems.length === 0) {
      dispatch(fetchCart());
    }
  }, [userInfo, navigate, dispatch]);

  const updateQty = async (item, qty) => {
    await dispatch(addToCartAsync({ ...item, _id: item._id, qty }));
  };

  const removeHandler = async (productId) => {
    await dispatch(removeFromCartAsync(productId));
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black flex items-center gap-4 text-textMain">
            <ShoppingCart className="h-10 w-10 text-secondary" />
            Shopping Cart
          </h1>
          <Link to="/" className="flex items-center gap-2 text-textSecondary hover:text-textMain transition-colors group font-bold">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            <p className="text-textSecondary uppercase tracking-widest font-black text-xs animate-pulse">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="card-dark p-20 text-center flex flex-col items-center border-dashed border-2 border-white/10">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <ShoppingCart className="h-16 w-16 text-secondary opacity-20" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-textMain">Your cart is empty</h2>
            <p className="text-textSecondary mb-10 max-w-md italic">
              Looks like you haven't added any premium gadgets yet. Start exploring!
            </p>
            <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-glow">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="card-dark group relative flex flex-col sm:flex-row gap-8 items-center p-6 border-white/5 hover:border-accent/20 transition-all">
                  <div className="relative aspect-square w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-dark/50 border border-white/5">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/200'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item._id}`} className="text-xl font-bold hover:text-secondary transition-colors mb-2 block truncate text-textMain">
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                      <div className="flex items-center gap-3 bg-dark/50 p-1.5 rounded-lg border border-white/10">
                        <button
                          onClick={() => updateQty(item, Math.max(1, item.qty - 1))}
                          disabled={loading}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#151B28] text-textMain hover:text-accent transition-all font-black disabled:opacity-50"
                        ><Minus className="h-4 w-4" /></button>
                        <span className="w-6 text-center font-bold text-sm text-textMain">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item, Math.min(item.countInStock, item.qty + 1))}
                          disabled={loading}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[#151B28] text-textMain hover:text-accent transition-all font-black disabled:opacity-50"
                        ><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-4 min-w-[120px]">
                    <p className="text-2xl font-black text-secondary">${(item.price * item.qty).toFixed(2)}</p>
                    <button
                      onClick={() => removeHandler(item._id)}
                      disabled={loading}
                      className="text-red-500/50 hover:text-red-500 p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-all group/trash disabled:opacity-50"
                    >
                      <Trash2 className="h-5 w-5 group-hover/trash:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card-dark p-8 shadow-glow border-accent/20 sticky top-32">
                <h3 className="text-xl font-bold mb-8 pb-4 border-b border-white/5 flex items-center gap-2 text-textMain">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  Order Summary
                </h3>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-textSecondary text-sm font-bold">
                    <span>Items Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                    <span className="text-textMain">
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-textSecondary text-sm font-bold">
                    <span>Estimated Shipping</span>
                    <span className="text-green-400 uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-textSecondary text-sm font-bold italic">
                    <span>Estimated Tax</span>
                    <span className="text-textMain">Calculated later</span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="text-lg font-bold text-textMain uppercase tracking-tighter">Grand Total</span>
                    <span className="text-3xl font-black text-secondary tracking-tighter">
                      ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-lg tracking-widest transition-all shadow-glow flex items-center justify-center gap-3 group active:scale-95"
                >
                  PROCEED TO CHECKOUT
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[10px] text-center text-textSecondary mt-6 uppercase tracking-widest font-black opacity-30">
                  Secure Checkout Guaranteed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
