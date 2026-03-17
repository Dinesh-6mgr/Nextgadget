import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { listProducts } from '../redux/slices/productSlice';
import api from '../api';
import Pagination from '../components/Pagination';
import { Loader2, Plus, Trash2, Edit3, ArrowLeft, ShoppingCart, Package, X, Users } from 'lucide-react';

const EMPTY_FORM = {
  name: '', description: '', category: '', brand: '',
  price: '', countInStock: '', images: '', featured: false,
};

const ProductModal = ({ initial, onClose, onSave, loading }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.description || !form.category || !form.price || form.countInStock === '') {
      setError('All fields except Brand and Images are required.');
      return;
    }
    await onSave({
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
    });
  };

  const fields = [
    { key: 'name', label: 'Product Name', type: 'text', required: true },
    { key: 'brand', label: 'Brand', type: 'text', required: false },
    { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Mobiles, Laptops' },
    { key: 'price', label: 'Price ($)', type: 'number', required: true },
    { key: 'countInStock', label: 'Count In Stock', type: 'number', required: true },
    { key: 'images', label: 'Image URLs (comma separated)', type: 'text', required: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#0A0F1C] border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl">
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <h2 className="text-xl font-black uppercase tracking-tighter text-textMain">
            {initial?._id ? 'Edit Product' : 'Create Product'}
          </h2>
          <button onClick={onClose} className="text-textSecondary hover:text-textMain transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          {fields.map(({ key, label, type, required, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-2">
                {label} {required && <span className="text-red-400">*</span>}
              </label>
              <input
                type={type}
                required={required}
                min={type === 'number' ? 0 : undefined}
                placeholder={placeholder || ''}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-[10px] font-black text-textSecondary uppercase tracking-[0.2em] mb-2">Description <span className="text-red-400">*</span></label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="w-full bg-dark border border-white/10 rounded-xl py-3 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="featured" className="text-sm font-bold text-textSecondary uppercase tracking-widest">Featured Product</label>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-textSecondary py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (initial?._id ? 'Save Changes' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminProductList = () => {
  const { pageNumber = 1 } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { products, loading, error, page, pages } = useSelector((state) => state.products);

  const [tab, setTab] = useState('products'); // 'products' | 'carts' | 'orders'
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', product }

  const [carts, setCarts] = useState([]);
  const [cartsLoading, setCartsLoading] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!userInfo?.isAdmin) { navigate('/'); return; }
    dispatch(listProducts({ pageNumber, pageSize: 12 }));
  }, [dispatch, pageNumber, userInfo, navigate]);

  useEffect(() => {
    if (tab === 'carts' && carts.length === 0) fetchCarts();
    if (tab === 'orders' && orders.length === 0) fetchOrders();
  }, [tab]);

  const fetchCarts = async () => {
    setCartsLoading(true);
    try {
      const { data } = await api.get('/admin/carts');
      setCarts(data);
    } catch (e) { /* silent */ }
    setCartsLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (e) { /* silent */ }
    setOrdersLoading(false);
  };

  const refresh = () => dispatch(listProducts({ pageNumber, pageSize: 12 }));

  const handleCreate = async (formData) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post('/products', formData);
      setModal(null);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    }
    setActionLoading(false);
  };

  const handleEdit = async (formData) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.put(`/products/${modal.product._id}`, formData);
      setModal(null);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    }
    setActionLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/products/${id}`);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    }
    setActionLoading(false);
  };

  const tabs = [
    { key: 'products', label: 'Products', icon: Package },
    { key: 'carts', label: 'User Carts', icon: ShoppingCart },
    { key: 'orders', label: 'Orders', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {modal && (
        <ProductModal
          initial={modal.mode === 'edit' ? { ...modal.product, images: modal.product.images?.join(', ') || '' } : null}
          onClose={() => { setModal(null); setActionError(null); }}
          onSave={modal.mode === 'edit' ? handleEdit : handleCreate}
          loading={actionLoading}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <button onClick={() => navigate('/')}
              className="flex items-center gap-2 text-textSecondary hover:text-textMain mb-4 transition-colors group font-bold text-xs uppercase tracking-widest">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </button>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-textMain mb-3">Admin Dashboard</h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
          {tab === 'products' && (
            <button onClick={() => setModal({ mode: 'create' })} disabled={actionLoading}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-dark px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow">
              <Plus className="h-4 w-4" /> Create Product
            </button>
          )}
        </div>

        {actionError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm mb-6 font-bold">
            {actionError}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#0A0F1C]/60 p-1.5 rounded-2xl border border-white/5 w-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                tab === key ? 'bg-primary text-white shadow-glow' : 'text-textSecondary hover:text-textMain'
              }`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          loading || actionLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0A0F1C]/60">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#0A0F1C]/90 text-textSecondary uppercase text-xs tracking-widest">
                    <tr>
                      <th className="px-4 py-4">ID</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Stock</th>
                      <th className="px-4 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-4 py-4 text-xs text-textSecondary font-bold">{product._id.slice(-6)}</td>
                        <td className="px-4 py-4 font-black text-textMain">{product.name}</td>
                        <td className="px-4 py-4 text-textSecondary font-bold">{product.category}</td>
                        <td className="px-4 py-4 font-black text-accent">${product.price}</td>
                        <td className="px-4 py-4 font-black text-textSecondary">{product.countInStock}</td>
                        <td className="px-4 py-4 flex items-center gap-2">
                          <button onClick={() => setModal({ mode: 'edit', product })}
                            className="inline-flex items-center gap-2 bg-[#1E2535] hover:bg-[#2A3348] text-textSecondary px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                            <Edit3 className="h-4 w-4" /> Edit
                          </button>
                          <button onClick={() => handleDelete(product._id)}
                            className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-10">
                <Pagination pages={pages} page={page} keyword="" category="" isAdmin />
              </div>
            </>
          )
        )}

        {/* Carts Tab */}
        {tab === 'carts' && (
          cartsLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            </div>
          ) : carts.length === 0 ? (
            <div className="card-dark p-20 text-center border-dashed border-2 border-white/10">
              <ShoppingCart className="h-16 w-16 text-textSecondary opacity-20 mx-auto mb-4" />
              <p className="text-textSecondary font-black uppercase tracking-widest text-sm">No active user carts</p>
            </div>
          ) : (
            <div className="space-y-6">
              {carts.map((entry) => (
                <div key={entry.userId} className="card-dark border-white/5 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                    <div>
                      <p className="font-black text-textMain">{entry.userName}</p>
                      <p className="text-xs text-textSecondary">{entry.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-textSecondary uppercase tracking-widest font-bold">Cart Total</p>
                      <p className="font-black text-accent text-lg">${entry.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-textSecondary uppercase text-xs tracking-widest">
                        <tr>
                          <th className="px-6 py-3 text-left">Product</th>
                          <th className="px-6 py-3 text-left">Price</th>
                          <th className="px-6 py-3 text-left">Qty</th>
                          <th className="px-6 py-3 text-left">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entry.cart.map((item, i) => (
                          <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                            <td className="px-6 py-3 font-bold text-textMain flex items-center gap-3">
                              {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />}
                              {item.name}
                            </td>
                            <td className="px-6 py-3 text-textSecondary font-bold">${item.price}</td>
                            <td className="px-6 py-3 text-textSecondary font-bold">{item.qty}</td>
                            <td className="px-6 py-3 font-black text-accent">${(item.price * item.qty).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          ordersLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="card-dark p-20 text-center border-dashed border-2 border-white/10">
              <p className="text-textSecondary font-black uppercase tracking-widest text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0A0F1C]/60">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#0A0F1C]/90 text-textSecondary uppercase text-xs tracking-widest">
                  <tr>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Total</th>
                    <th className="px-4 py-4">Paid</th>
                    <th className="px-4 py-4">Delivered</th>
                    <th className="px-4 py-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
                      onClick={() => navigate(`/order/${order._id}`)}>
                      <td className="px-4 py-4 text-xs text-textSecondary font-bold">{order._id.slice(-6)}</td>
                      <td className="px-4 py-4 font-bold text-textMain">{order.user?.name || 'N/A'}</td>
                      <td className="px-4 py-4 font-black text-accent">${order.totalPrice}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${order.isDelivered ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {order.isDelivered ? 'Delivered' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-textSecondary text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
