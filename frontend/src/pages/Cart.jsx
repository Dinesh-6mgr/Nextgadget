import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCartAsync, updateQtyLocal, updateCartQty, removeItemLocal } from '../redux/slices/cartSlice';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, Minus, Plus, CreditCard, Loader2, Check } from 'lucide-react';
import useCurrency from '../hooks/useCurrency';

const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const price     = useCurrency();

  const { userInfo }            = useSelector((s) => s.auth);
  const { cartItems, loading }  = useSelector((s) => s.cart);

  // selected item IDs — default all selected
  const [selected, setSelected] = useState({});

  // when cart loads / changes, ensure new items are selected by default
  useEffect(() => {
    setSelected((prev) => {
      const next = { ...prev };
      cartItems.forEach((item) => {
        if (next[item._id] === undefined) next[item._id] = true;
      });
      // remove keys for items no longer in cart
      Object.keys(next).forEach((id) => {
        if (!cartItems.find((i) => i._id === id)) delete next[id];
      });
      return next;
    });
  }, [cartItems]);

  useEffect(() => {
    if (!userInfo) { navigate('/login?redirect=/cart'); return; }
    if (cartItems.length === 0) dispatch(fetchCart());
  }, [userInfo, navigate, dispatch]);

  const toggleItem  = (id) => setSelected((p) => ({ ...p, [id]: !p[id] }));
  const allChecked  = cartItems.length > 0 && cartItems.every((i) => selected[i._id]);
  const toggleAll   = () => {
    const next = !allChecked;
    const map  = {};
    cartItems.forEach((i) => { map[i._id] = next; });
    setSelected(map);
  };

  const selectedItems = cartItems.filter((i) => selected[i._id]);
  const selectedQty   = selectedItems.reduce((a, i) => a + i.qty, 0);
  const selectedTotal = selectedItems.reduce((a, i) => a + i.qty * i.price, 0);

  const [stockAlert, setStockAlert] = useState(null); // { name, max }

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    if (qty > item.countInStock) {
      setStockAlert({ name: item.name, max: item.countInStock });
      setTimeout(() => setStockAlert(null), 3000);
      return;
    }
    dispatch(updateQtyLocal({ _id: item._id, qty }));
    dispatch(updateCartQty({ ...item, qty }));
  };

  const removeHandler = (id) => {
    dispatch(removeItemLocal(id));
    dispatch(removeFromCartAsync(id));
  };

  const checkoutHandler = () => {
    if (selectedItems.length === 0) return;
    // store selected items in sessionStorage so PlaceOrder can use them
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/shipping');
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Stock alert toast */}
        {stockAlert && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0A0F1C] border border-red-500/40 text-red-400 px-6 py-4 rounded-2xl shadow-2xl animate-bounce-once">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-black text-sm uppercase tracking-wide">Out of Stock</p>
              <p className="text-xs text-textSecondary mt-0.5">
                Only <span className="text-red-400 font-black">{stockAlert.max}</span> units of <span className="font-bold">{stockAlert.name}</span> available
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black flex items-center gap-4 text-textMain">
            <ShoppingCart className="h-10 w-10 text-secondary" />
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="text-lg font-bold text-textSecondary">({cartItems.length})</span>
            )}
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
              Looks like you haven't added any premium gadgets yet.
            </p>
            <Link to="/" className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-glow">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Select All row */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                <button
                  onClick={toggleAll}
                  className="flex items-center gap-3 text-sm font-black text-textSecondary hover:text-textMain transition-colors"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    allChecked ? 'bg-primary border-primary' : 'border-white/20 hover:border-primary/50'
                  }`}>
                    {allChecked && <Check className="h-3 w-3 text-white" />}
                  </div>
                  Select All ({cartItems.length} items)
                </button>
                {selectedItems.length > 0 && (
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {selectedItems.length} selected
                  </span>
                )}
              </div>

              {cartItems.map((item) => {
                const isSelected = !!selected[item._id];
                return (
                  <div
                    key={item._id}
                    className={`card-dark group relative flex flex-col sm:flex-row gap-6 items-center p-5 transition-all ${
                      isSelected ? 'border-primary/30 bg-primary/5' : 'border-white/5 opacity-60'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleItem(item._id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-primary border-primary' : 'border-white/20 hover:border-primary/50'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </button>

                    {/* Image */}
                    <div className="relative aspect-square w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-dark/50 border border-white/5">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/200'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left min-w-0">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-base font-bold hover:text-secondary transition-colors block truncate text-textMain"
                      >
                        {item.name}
                      </Link>
                      <p className="text-accent font-black text-lg mt-1">{price(item.price)}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
                        <div className="flex items-center gap-2 bg-dark/50 p-1 rounded-lg border border-white/10">
                          <button
                            onClick={() => updateQty(item, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md bg-[#151B28] text-textMain hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          ><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-6 text-center font-bold text-sm text-textMain">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item, item.qty + 1)}
                            className={`w-7 h-7 flex items-center justify-center rounded-md bg-[#151B28] transition-all font-black
                              ${item.qty >= item.countInStock
                                ? 'text-red-400/70 cursor-pointer'
                                : 'text-textMain hover:text-accent'}`}
                          ><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <span className="text-[10px] text-textSecondary font-bold uppercase tracking-widest">
                          / {item.countInStock} in stock
                        </span>
                      </div>
                    </div>

                    {/* Price + Remove */}
                    <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-3 min-w-[100px]">
                      <p className="text-xl font-black text-secondary">{price(item.price * item.qty)}</p>
                      <button
                        onClick={() => removeHandler(item._id)}
                        className="text-red-500/50 hover:text-red-500 p-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="card-dark p-8 shadow-glow border-accent/20 sticky top-32">
                <h3 className="text-xl font-bold mb-6 pb-4 border-b border-white/5 flex items-center gap-2 text-textMain">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  Order Summary
                </h3>

                {selectedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-textSecondary text-sm font-bold">No items selected</p>
                    <p className="text-textSecondary/50 text-xs mt-1">Select items above to checkout</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {/* Selected items breakdown */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedItems.map((item) => (
                        <div key={item._id} className="flex justify-between text-xs text-textSecondary font-bold">
                          <span className="truncate max-w-[140px]">{item.name} × {item.qty}</span>
                          <span className="text-textMain ml-2 flex-shrink-0">{price(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-3">
                      <div className="flex justify-between text-textSecondary text-sm font-bold">
                        <span>Items ({selectedQty})</span>
                        <span className="text-textMain">{price(selectedTotal)}</span>
                      </div>
                      <div className="flex justify-between text-textSecondary text-sm font-bold">
                        <span>Shipping</span>
                        <span className="text-green-400">FREE</span>
                      </div>
                      <div className="flex justify-between text-textSecondary text-sm font-bold italic">
                        <span>Tax</span>
                        <span className="text-textMain">Calculated later</span>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                        <span className="text-base font-bold text-textMain uppercase tracking-tighter">Total</span>
                        <span className="text-2xl font-black text-secondary tracking-tighter">
                          {price(selectedTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={checkoutHandler}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-black text-lg tracking-widest transition-all shadow-glow flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  CHECKOUT ({selectedItems.length})
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[10px] text-center text-textSecondary mt-4 uppercase tracking-widest font-black opacity-30">
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
