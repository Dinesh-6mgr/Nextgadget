import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../redux/slices/cartSlice';
import api from '../api';
import {
  Smartphone, Laptop, Camera, Watch, Headphones,
  ChevronRight, Star, ArrowRight, Loader2, ShoppingCart,
  Check, Zap, TrendingUp, Sparkles, BadgeCheck, Package,
} from 'lucide-react';
import useCurrency from '../hooks/useCurrency';

/* ─── reusable product card ─────────────────────────────────────── */
const ProductCard = ({ product, onAddToCart, addedMap, cartItems, price, badge }) => {
  const inCart = cartItems.some(i => i._id === product._id);
  const added  = addedMap[product._id];

  return (
    <div className="group card-dark relative flex flex-col h-full overflow-hidden border-white/5 hover:border-accent/30 p-4 transition-all">
      {badge && (
        <div className="absolute top-5 left-5 z-20">
          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
      )}
      <div className="absolute top-5 right-5 z-20">
        <span className="bg-[#0A0F1C]/90 backdrop-blur-md text-secondary text-[10px] font-black px-2.5 py-1 rounded-full border border-secondary/20 flex items-center gap-1">
          <Star className="h-3 w-3 fill-secondary text-secondary" /> {product.rating}
        </span>
      </div>
      <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square bg-dark/50">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors duration-500" />
        <Link
          to={`/product/${product._id}`}
          className="absolute bottom-3 left-3 right-3 bg-white text-dark py-3 rounded-xl font-black text-xs tracking-[0.2em] uppercase opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-2xl text-center hover:bg-secondary hover:text-white"
        >
          View Details
        </Link>
      </div>
      <div className="px-1 pb-1 flex flex-col flex-1">
        <h3 className="font-black text-sm mb-1 group-hover:text-secondary transition-colors truncate uppercase tracking-tight text-textMain">{product.name}</h3>
        <span className="text-[10px] font-bold text-textSecondary/50 uppercase tracking-widest mb-2">{product.category}</span>
        <div className="mt-auto">
          <p className="text-accent font-black text-xl tracking-tighter mb-3">{price(product.price)}</p>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.countInStock === 0 || added || inCart}
            className={`w-full flex items-center justify-center gap-2 border py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:cursor-not-allowed
              ${inCart
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : added
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : product.countInStock === 0
                    ? 'bg-white/5 border-white/10 text-textSecondary opacity-40'
                    : 'bg-primary/10 hover:bg-primary text-secondary hover:text-white border-primary/20 hover:border-primary'}`}
          >
            {inCart ? <><Check className="h-3.5 w-3.5" /> In Cart</>
              : added ? <><Check className="h-3.5 w-3.5" /> Added!</>
              : product.countInStock === 0 ? 'Out of Stock'
              : <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── section header ─────────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, subtitle, to, iconColor = 'text-secondary' }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`h-6 w-6 ${iconColor}`} />
        <h2 className="text-3xl font-black tracking-tighter uppercase text-textMain">{title}</h2>
      </div>
      {subtitle && <p className="text-textSecondary text-sm ml-9">{subtitle}</p>}
      <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full mt-2 ml-9" />
    </div>
    {to && (
      <Link to={to} className="text-secondary hover:text-accent flex items-center gap-2 font-black uppercase text-xs tracking-widest group transition-colors">
        View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

/* ─── horizontal scroll row ──────────────────────────────────────── */
const ProductRow = ({ products, onAddToCart, addedMap, cartItems, price, getBadge }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
    {products.map(p => (
      <ProductCard
        key={p._id}
        product={p}
        onAddToCart={onAddToCart}
        addedMap={addedMap}
        cartItems={cartItems}
        price={price}
        badge={getBadge ? getBadge(p) : null}
      />
    ))}
  </div>
);

/* ─── skeleton loader ────────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="card-dark p-4 animate-pulse">
        <div className="aspect-square rounded-2xl bg-white/5 mb-4" />
        <div className="h-3 bg-white/5 rounded mb-2 w-3/4" />
        <div className="h-3 bg-white/5 rounded mb-4 w-1/2" />
        <div className="h-8 bg-white/5 rounded" />
      </div>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════ */
const Home = () => {
  const price    = useCurrency();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedMap, setAddedMap] = useState({});

  const { userInfo } = useSelector(s => s.auth);
  const { cartItems } = useSelector(s => s.cart);

  const [featured,   setFeatured]   = useState([]);
  const [topRated,   setTopRated]   = useState([]);
  const [newest,     setNewest]     = useState([]);
  const [deals,      setDeals]      = useState([]);
  const [loadingMap, setLoadingMap] = useState({ featured: true, topRated: true, newest: true, deals: true });

  const setLoaded = (key) => setLoadingMap(m => ({ ...m, [key]: false }));

  useEffect(() => {
    // Featured / hero products
    api.get('/products?featured=true&pageSize=5')
      .then(r => { setFeatured(r.data.products); setLoaded('featured'); })
      .catch(() => setLoaded('featured'));

    // Top rated — sort by rating desc
    api.get('/products?sort=rating&pageSize=5')
      .then(r => { setTopRated(r.data.products); setLoaded('topRated'); })
      .catch(() => setLoaded('topRated'));

    // Newest — sort by createdAt desc
    api.get('/products?sort=newest&pageSize=5')
      .then(r => { setNewest(r.data.products); setLoaded('newest'); })
      .catch(() => setLoaded('newest'));

    // Deals — low price, in stock
    api.get('/products?sort=price_asc&pageSize=5')
      .then(r => { setDeals(r.data.products); setLoaded('deals'); })
      .catch(() => setLoaded('deals'));
  }, []);

  const handleAddToCart = async (product) => {
    if (!userInfo) { navigate('/login?redirect=/'); return; }
    const result = await dispatch(addToCartAsync({ ...product, qty: 1 }));
    if (addToCartAsync.fulfilled.match(result)) {
      setAddedMap(prev => ({ ...prev, [product._id]: true }));
      setTimeout(() => setAddedMap(prev => ({ ...prev, [product._id]: false })), 2000);
    } else {
      alert(result.payload || 'Failed to add to cart');
    }
  };

  const categories = [
    { name: 'Mobiles',   icon: Smartphone, color: 'from-blue-500/20',    accent: 'text-blue-400' },
    { name: 'Laptops',   icon: Laptop,     color: 'from-purple-500/20',  accent: 'text-purple-400' },
    { name: 'Cameras',   icon: Camera,     color: 'from-red-500/20',     accent: 'text-red-400' },
    { name: 'Watches',   icon: Watch,      color: 'from-emerald-500/20', accent: 'text-emerald-400' },
    { name: 'Audio',     icon: Headphones, color: 'from-amber-500/20',   accent: 'text-amber-400' },
  ];

  return (
    <div className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 space-y-24">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E88E5]/10 via-[#0A0F1C] to-[#00E5FF]/10 border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1E88E5]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 md:p-16 items-center">
          <div className="z-10 text-center md:text-left">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-secondary border border-secondary/20 mb-6 uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3 mr-1.5" /> Latest Innovation
            </span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Future Tech, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                Right Now.
              </span>
            </h1>
            <p className="text-xl text-textSecondary mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed italic border-l-4 border-primary/20 pl-6">
              Discover the next generation of premium gadgets designed to elevate your digital lifestyle.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link to="/shop" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black transition-all shadow-glow flex items-center gap-2 group active:scale-95">
                Explore Now <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/shop" className="bg-white/5 hover:bg-white/10 text-textMain px-8 py-4 rounded-xl font-black transition-all border border-white/10 backdrop-blur-sm active:scale-95">
                Collections
              </Link>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700 animate-pulse" />
            <img
              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1000"
              alt="Featured"
              className="relative z-10 w-full h-auto drop-shadow-2xl rounded-2xl transform group-hover:rotate-3 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section>
        <SectionHeader icon={Package} title="Shop by Category" to="/shop" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={`/shop/category/${cat.name}`}
              className={`group relative bg-[#151B28] border border-white/5 p-8 rounded-3xl transition-all hover:-translate-y-2 hover:shadow-glow hover:border-white/10 overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <cat.icon className={`h-10 w-10 mb-4 mx-auto transition-all transform group-hover:scale-110 text-textSecondary group-hover:${cat.accent}`} />
              <span className="block text-xs font-black text-center tracking-[0.2em] uppercase text-textSecondary group-hover:text-textMain">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={BadgeCheck}
          title="Featured Picks"
          subtitle="Hand-picked premium gadgets"
          to="/shop"
          iconColor="text-accent"
        />
        {loadingMap.featured ? <SkeletonRow /> : featured.length > 0 ? (
          <ProductRow
            products={featured}
            onAddToCart={handleAddToCart}
            addedMap={addedMap}
            cartItems={cartItems}
            price={price}
            getBadge={() => ({ label: 'Featured', cls: 'bg-accent/20 text-accent border border-accent/30' })}
          />
        ) : (
          <TopRatedFallback products={topRated} onAddToCart={handleAddToCart} addedMap={addedMap} cartItems={cartItems} price={price} />
        )}
      </section>

      {/* ── PROMO BANNER ─────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 to-[#0A0F1C] border border-primary/20 p-8 flex items-center gap-6 group hover:shadow-glow transition-all">
          <div className="absolute right-0 top-0 w-40 h-40 bg-primary/10 rounded-bl-full blur-2xl" />
          <div className="p-4 bg-primary/20 rounded-2xl">
            <Zap className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Limited Time</p>
            <h3 className="text-2xl font-black text-textMain mb-1">Flash Deals</h3>
            <p className="text-textSecondary text-sm">Best prices on top gadgets</p>
          </div>
          <Link to="/shop" className="ml-auto bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow active:scale-95 flex-shrink-0">
            Shop Now
          </Link>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/20 to-[#0A0F1C] border border-secondary/20 p-8 flex items-center gap-6 group hover:shadow-glow transition-all">
          <div className="absolute right-0 top-0 w-40 h-40 bg-secondary/10 rounded-bl-full blur-2xl" />
          <div className="p-4 bg-secondary/20 rounded-2xl">
            <Sparkles className="h-10 w-10 text-secondary" />
          </div>
          <div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">New Arrivals</p>
            <h3 className="text-2xl font-black text-textMain mb-1">Just Landed</h3>
            <p className="text-textSecondary text-sm">Fresh tech, straight to you</p>
          </div>
          <Link to="/shop" className="ml-auto bg-secondary hover:bg-secondary/90 text-dark px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex-shrink-0">
            Explore
          </Link>
        </div>
      </section>

      {/* ── TOP RATED ────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Star}
          title="Top Rated"
          subtitle="Highest rated by our customers"
          to="/shop"
          iconColor="text-secondary"
        />
        {loadingMap.topRated ? <SkeletonRow /> : (
          <ProductRow
            products={topRated}
            onAddToCart={handleAddToCart}
            addedMap={addedMap}
            cartItems={cartItems}
            price={price}
            getBadge={p => p.rating >= 4.5 ? { label: '⭐ Top Rated', cls: 'bg-secondary/20 text-secondary border border-secondary/30' } : null}
          />
        )}
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={Sparkles}
          title="New Arrivals"
          subtitle="The latest additions to our store"
          to="/shop"
          iconColor="text-accent"
        />
        {loadingMap.newest ? <SkeletonRow /> : (
          <ProductRow
            products={newest}
            onAddToCart={handleAddToCart}
            addedMap={addedMap}
            cartItems={cartItems}
            price={price}
            getBadge={() => ({ label: 'New', cls: 'bg-green-500/20 text-green-400 border border-green-500/30' })}
          />
        )}
      </section>

      {/* ── BEST DEALS ───────────────────────────────────────────── */}
      <section>
        <SectionHeader
          icon={TrendingUp}
          title="Best Deals"
          subtitle="Great gadgets at great prices"
          to="/shop"
          iconColor="text-primary"
        />
        {loadingMap.deals ? <SkeletonRow /> : (
          <ProductRow
            products={deals}
            onAddToCart={handleAddToCart}
            addedMap={addedMap}
            cartItems={cartItems}
            price={price}
            getBadge={() => ({ label: '🔥 Deal', cls: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' })}
          />
        )}
      </section>

      {/* ── WHY US ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Zap,        title: 'Fast Delivery',    desc: 'Same-day dispatch on orders before 2PM' },
          { icon: BadgeCheck, title: 'Genuine Products',  desc: '100% authentic, warranty included' },
          { icon: ShoppingCart, title: 'Easy Returns',   desc: '30-day hassle-free return policy' },
          { icon: Star,       title: 'Top Rated',        desc: 'Trusted by thousands of customers' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-[#0A0F1C] border border-white/5 rounded-2xl p-6 text-center hover:border-primary/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-black text-sm uppercase tracking-tight text-textMain mb-1">{title}</h4>
            <p className="text-textSecondary text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-[#0A0F1C] to-secondary/20 border border-white/5 p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl pointer-events-none" />
        <h2 className="text-4xl font-black uppercase tracking-tighter text-textMain mb-4 relative z-10">
          Ready to Upgrade?
        </h2>
        <p className="text-textSecondary mb-8 max-w-md mx-auto relative z-10">
          Browse our full collection of premium gadgets and find your next favourite device.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-glow active:scale-95 relative z-10"
        >
          Shop All Products <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

    </div>
  );
};

// fallback if featured is empty — show top rated instead
const TopRatedFallback = (props) => <ProductRow {...props} getBadge={null} />;

export default Home;
