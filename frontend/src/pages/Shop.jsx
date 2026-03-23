import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listProducts } from '../redux/slices/productSlice';
import { addToCartAsync } from '../redux/slices/cartSlice';
import { Star, Loader2, ArrowLeft, ShoppingCart, Filter, LayoutGrid, SlidersHorizontal, Check } from 'lucide-react';
import Pagination from '../components/Pagination';
import useCurrency from '../hooks/useCurrency';

const Shop = () => {
  const { keyword, category, pageNumber = 1 } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error, page, pages } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [addedMap, setAddedMap] = useState({});
  const price = useCurrency();

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      navigate(`/login?redirect=/shop`);
      return;
    }
    const result = await dispatch(addToCartAsync({ ...product, qty: 1 }));
    if (addToCartAsync.fulfilled.match(result)) {
      setAddedMap((prev) => ({ ...prev, [product._id]: true }));
      setTimeout(() => setAddedMap((prev) => ({ ...prev, [product._id]: false })), 2000);
    } else {
      alert(result.payload || 'Failed to add to cart');
    }
  };

  useEffect(() => {
    dispatch(listProducts({ keyword, category, pageNumber, pageSize: 12 }));
  }, [dispatch, keyword, category, pageNumber]);

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-textSecondary hover:text-textMain mb-6 transition-colors group font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-textMain mb-4">
              {category ? `${category} Collection` : keyword ? `Search: ${keyword}` : 'All Gadgets'}
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#151B28] border border-white/5 p-1 rounded-xl flex">
              <button className="p-2.5 rounded-lg bg-primary text-white shadow-glow"><LayoutGrid className="h-5 w-5" /></button>
              <button className="p-2.5 rounded-lg text-textSecondary hover:text-textMain transition-colors"><SlidersHorizontal className="h-5 w-5" /></button>
            </div>
            <button className="flex items-center gap-2 bg-[#151B28] border border-white/10 px-6 py-3 rounded-xl text-textSecondary hover:text-textMain transition-all font-black text-xs uppercase tracking-widest group">
              <Filter className="h-4 w-4 group-hover:text-accent transition-colors" />
              Filter System
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            <p className="text-textSecondary uppercase tracking-widest font-black text-xs animate-pulse">Accessing Data Bank...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center shadow-xl">
            <p className="font-black uppercase tracking-widest text-sm mb-2 font-black uppercase tracking-widest text-sm mb-2">Transmission Link Broken</p>
            <p className="text-textSecondary text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card-dark p-20 text-center flex flex-col items-center border-dashed border-2 border-white/10">
            <div className="bg-red-500/10 p-6 rounded-full mb-6">
              <ShoppingCart className="h-16 w-16 text-red-400 opacity-20" />
            </div>
            <h2 className="text-2xl font-black mb-4 text-textMain uppercase tracking-tighter">OUT OF STOCK</h2>
            <p className="text-textSecondary mb-10 max-w-md italic font-bold">
              All inventory for this sector has been depleted. Please check other transmission frequencies.
            </p>
            <Link 
              to="/shop" 
              className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-black transition-all shadow-glow uppercase tracking-widest text-xs"
            >
              Scan All Frequencies
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.map((product) => (
                <div key={product._id} className="group card-dark relative flex flex-col h-full overflow-hidden border-white/5 hover:border-accent/30 p-4">
                  <div className="absolute top-6 right-6 z-20">
                     <span className="bg-[#0A0F1C]/90 backdrop-blur-md text-secondary text-[10px] font-black px-3 py-1.5 rounded-full border border-secondary/20 flex items-center gap-1.5 shadow-xl">
                       <Star className="h-3 w-3 fill-secondary text-secondary" /> {product.rating}
                     </span>
                  </div>
                  <div className="relative mb-6 overflow-hidden rounded-2xl aspect-square bg-dark/50">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/400'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500" />
                    <Link 
                      to={`/product/${product._id}`}
                      className="absolute bottom-4 left-4 right-4 bg-white text-dark py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-2xl text-center hover:bg-secondary hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                  <div className="px-2 pb-2">
                    <h3 className="font-black text-lg mb-2 group-hover:text-secondary transition-colors truncate uppercase tracking-tight text-textMain">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-accent font-black text-2xl tracking-tighter">{price(product.price)}</p>
                      <span className="text-[10px] font-bold text-textSecondary/50 uppercase tracking-widest">{product.category}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock === 0 || addedMap[product._id] || cartItems.some(i => i._id === product._id)}
                      className={`mt-4 w-full flex items-center justify-center gap-2 border py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed
                        ${cartItems.some(i => i._id === product._id)
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : addedMap[product._id]
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : product.countInStock === 0
                              ? 'bg-primary/10 border-primary/20 text-secondary opacity-40'
                              : 'bg-primary/10 hover:bg-primary text-secondary hover:text-white border-primary/20 hover:border-primary'}`}
                    >
                      {cartItems.some(i => i._id === product._id)
                        ? <><Check className="h-4 w-4" /> In Cart</>
                        : addedMap[product._id]
                          ? <><Check className="h-4 w-4" /> Added!</>
                          : product.countInStock === 0
                            ? 'Out of Stock'
                            : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <Pagination 
              pages={pages} 
              page={page} 
              keyword={keyword} 
              category={category} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
