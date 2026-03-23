import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails } from '../redux/slices/productSlice';
import { addToCartAsync } from '../redux/slices/cartSlice';
import { ShoppingCart, Star, ArrowLeft, Loader2, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import useCurrency from '../hooks/useCurrency';

const ProductDetails = () => {
  const [qty, setQty] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { product, loading, error } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);

  const inCart = cartItems.some((i) => i._id === product?._id);
  const price = useCurrency();

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  const addToCartHandler = async () => {
    if (!userInfo) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }
    setCartLoading(true);
    setCartError(null);
    const result = await dispatch(addToCartAsync({ ...product, qty }));
    setCartLoading(false);
    if (!addToCartAsync.fulfilled.match(result)) {
      setCartError(result.payload || 'Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <Loader2 className="h-12 w-12 text-secondary animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-32 px-4 bg-dark">
      <div className="max-w-7xl mx-auto bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-center shadow-xl">
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-textSecondary hover:text-textMain mb-12 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to browsing
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl pointer-events-none" />
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151B28]">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/800'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-secondary border border-secondary/20 uppercase tracking-widest mb-4">
                {product.brand || 'Premium Gadget'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-textMain">{product.name}</h1>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/20">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="text-sm font-bold text-textMain">{product.rating}</span>
                  <span className="text-xs text-textSecondary border-l border-white/10 pl-2 ml-1">
                    {product.numReviews} Reviews
                  </span>
                </div>
                <div className={`flex items-center gap-2 text-sm font-bold ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.countInStock > 0 && <Check className="h-4 w-4" />}
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <p className="text-xl text-textSecondary leading-relaxed mb-10 border-l-4 border-primary pl-6 py-2 bg-primary/5 italic">
                "{product.description}"
              </p>
            </div>

            <div className="mt-auto card-dark p-8 shadow-glow border-accent/20">
              <div className="flex items-end justify-between mb-8 pb-8 border-b border-white/5">
                <div>
                  <p className="text-xs text-textSecondary uppercase tracking-widest mb-2 font-bold">Total Price</p>
                  <p className="text-4xl font-black text-secondary">{price(product.price)}</p>
                </div>
                {product.countInStock > 0 && (
                  <div className="flex items-center gap-4 bg-dark/50 p-2 rounded-xl border border-white/5">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0A0F1C] border border-white/10 text-textMain hover:border-accent transition-all font-black text-xl"
                    >-</button>
                    <span className="w-8 text-center font-black text-xl">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0A0F1C] border border-white/10 text-textMain hover:border-accent transition-all font-black text-xl"
                    >+</button>
                  </div>
                )}
              </div>

              {cartError && (
                <p className="text-red-400 text-xs font-bold text-center mb-4">{cartError}</p>
              )}

              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0 || cartLoading || inCart}
                className={`w-full py-5 rounded-2xl font-black text-xl tracking-wider transition-all shadow-glow flex items-center justify-center gap-4 ${
                  inCart
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                    : product.countInStock > 0
                      ? 'bg-primary hover:bg-primary/90 text-white transform hover:-translate-y-1 active:scale-95'
                      : 'bg-white/5 text-textSecondary cursor-not-allowed border border-white/10'
                }`}
              >
                {cartLoading
                  ? <Loader2 className="h-6 w-6 animate-spin" />
                  : inCart
                    ? <Check className="h-6 w-6" />
                    : <ShoppingCart className="h-6 w-6" />}
                {cartLoading ? 'Adding...' : inCart ? 'In Cart' : product.countInStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                <ShieldCheck className="h-6 w-6 text-accent mb-2" />
                <span className="text-[10px] font-bold text-textSecondary uppercase">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                <Truck className="h-6 w-6 text-accent mb-2" />
                <span className="text-[10px] font-bold text-textSecondary uppercase">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors">
                <RotateCcw className="h-6 w-6 text-accent mb-2" />
                <span className="text-[10px] font-bold text-textSecondary uppercase">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
