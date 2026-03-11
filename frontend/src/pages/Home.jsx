import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../redux/slices/productSlice';
import { Smartphone, Laptop, Camera, Watch, Headphones, ChevronRight, Star, ArrowRight, Loader2, ShoppingCart } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('');
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    // For Home, we just fetch all and filter locally for responsiveness, 
    // or we could fetch by category. Let's fetch by category for accuracy.
    dispatch(listProducts({ category: selectedCategory, pageSize: 8 }));
  }, [dispatch, selectedCategory]);

  const categories = [
    { name: 'Mobiles', icon: Smartphone, color: 'from-blue-500/20' },
    { name: 'Laptops', icon: Laptop, color: 'from-purple-500/20' },
    { name: 'Cameras', icon: Camera, color: 'from-red-500/20' },
    { name: 'Watches', icon: Watch, color: 'from-emerald-500/20' },
    { name: 'Audio', icon: Headphones, color: 'from-amber-500/20' },
  ];

  return (
    <div className="pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24">
      {/* ... Hero Section remains same ... */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E88E5]/10 via-[#0A0F1C] to-[#00E5FF]/10 border border-white/5 mb-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1E88E5]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-16 items-center">
          <div className="z-10 text-center md:text-left">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-secondary border border-secondary/20 mb-6 uppercase tracking-[0.2em]">
              Latest Innovation
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Future Tech, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                Right Now.
              </span>
            </h1>
            <p className="text-xl text-textSecondary mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed italic border-l-4 border-primary/20 pl-6">
              Discover the next generation of premium gadgets designed to elevate your digital lifestyle. Experience the peak of performance.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link to="/shop" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black transition-all shadow-glow flex items-center gap-2 group active:scale-95">
                Explore Now
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="bg-white/5 hover:bg-white/10 text-textMain px-8 py-4 rounded-xl font-black transition-all border border-white/10 backdrop-blur-sm active:scale-95">
                Collections
              </Link>
            </div>
          </div>
          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700 animate-pulse" />
            <img 
              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1000" 
              alt="Featured Product" 
              className="relative z-10 w-full h-auto drop-shadow-2xl rounded-2xl transform group-hover:rotate-3 transition-transform duration-500 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase text-textMain">Shop by Category</h2>
            <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
          <Link to="/shop" className="text-secondary hover:text-accent flex items-center gap-2 font-black uppercase text-xs tracking-widest group transition-colors">
            See all collections <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <button 
              key={cat.name} 
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
              className={`group relative bg-[#151B28] border p-10 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-glow overflow-hidden ${
                selectedCategory === cat.name ? 'border-primary shadow-glow' : 'border-white/5'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <cat.icon className={`h-12 w-12 mb-6 mx-auto transition-all transform group-hover:scale-110 ${
                selectedCategory === cat.name ? 'text-primary' : 'text-textSecondary group-hover:text-accent'
              }`} />
              <span className={`block text-xs font-black text-center tracking-[0.2em] uppercase ${
                selectedCategory === cat.name ? 'text-primary' : 'group-hover:text-textMain'
              }`}>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black tracking-tighter uppercase text-textMain">
            {selectedCategory ? `${selectedCategory} Collection` : 'Featured Gadgets'}
          </h2>
          <div className="flex gap-4 items-center">
            <button className="px-6 py-2 rounded-xl bg-[#151B28] border border-white/5 text-textSecondary hover:text-textMain transition-all font-black uppercase text-[10px] tracking-widest">
              New Arrivals
            </button>
            <button className="px-6 py-2 rounded-xl bg-primary/10 border border-primary/20 text-secondary font-black uppercase text-[10px] tracking-widest">
              Popular
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            <p className="text-textSecondary uppercase tracking-widest font-black text-xs animate-pulse">Syncing with satellite...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center shadow-xl">
            <p className="font-black uppercase tracking-widest text-sm mb-2">Transmission Error</p>
            <p className="text-textSecondary text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card-dark p-20 text-center flex flex-col items-center border-dashed border-2 border-white/10">
            <div className="bg-red-500/10 p-6 rounded-full mb-6">
              <ShoppingCart className="h-16 w-16 text-red-400 opacity-20" />
            </div>
            <h2 className="text-2xl font-black mb-4 text-textMain uppercase tracking-tighter text-textMain">OUT OF STOCK</h2>
            <p className="text-textSecondary mb-10 max-w-md italic font-bold">
              All inventory for this sector has been depleted. Please check other transmission frequencies.
            </p>
            <button 
              onClick={() => setSelectedCategory('')}
              className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-xl font-black transition-all shadow-glow uppercase tracking-widest text-xs"
            >
              Scan All Frequencies
            </button>
          </div>
        ) : (
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
                    <p className="text-accent font-black text-2xl tracking-tighter">${product.price}</p>
                    <span className="text-[10px] font-bold text-textSecondary/50 uppercase tracking-widest">{product.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button at Bottom */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link 
              to={selectedCategory ? `/category/${selectedCategory}` : '/shop'}
              className="group flex items-center gap-4 bg-[#151B28] hover:bg-primary/10 border border-white/5 hover:border-primary/50 px-10 py-5 rounded-2xl transition-all duration-500 shadow-xl hover:shadow-glow active:scale-95"
            >
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-textSecondary group-hover:text-primary transition-colors">
                  System Protocol
                </span>
                <span className="text-xl font-black uppercase tracking-tighter text-textMain">
                  View All {selectedCategory || 'Products'}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <ArrowRight className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
