import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { listProducts } from '../../redux/slices/productSlice';
import api from '../../api';
import Pagination from '../../components/Pagination';
import { Loader2, Plus, Trash2, Edit3, X } from 'lucide-react';

const EMPTY = { name: '', description: '', category: '', brand: '', price: '', countInStock: '', images: '', featured: false };

const Modal = ({ initial, onClose, onSave, saving }) => {
  const [form, setForm] = useState(initial || EMPTY);
  const [err, setErr] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.category || !form.price || form.countInStock === '') {
      setErr('Name, Description, Category, Price and Stock are required.');
      return;
    }
    setErr('');
    await onSave({
      ...form,
      price: Number(form.price),
      countInStock: Number(form.countInStock),
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#0A0F1C] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="font-black uppercase tracking-widest text-sm text-textMain">
            {initial?._id ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} className="text-textSecondary hover:text-textMain"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {err && <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">{err}</p>}

          {[
            { k: 'name', label: 'Product Name', req: true },
            { k: 'brand', label: 'Brand' },
            { k: 'category', label: 'Category', req: true, ph: 'e.g. Mobiles, Laptops' },
            { k: 'price', label: 'Price ($)', type: 'number', req: true },
            { k: 'countInStock', label: 'Count In Stock', type: 'number', req: true },
            { k: 'images', label: 'Image URLs (comma separated)' },
          ].map(({ k, label, req, type = 'text', ph }) => (
            <div key={k}>
              <label className="block text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1.5">
                {label}{req && <span className="text-red-400 ml-1">*</span>}
              </label>
              <input type={type} min={type === 'number' ? 0 : undefined} placeholder={ph}
                value={form[k]} onChange={(e) => set(k, e.target.value)}
                className="w-full bg-[#070B14] border border-white/10 rounded-xl py-2.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all" />
            </div>
          ))}

          <div>
            <label className="block text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="w-full bg-[#070B14] border border-white/10 rounded-xl py-2.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all resize-none" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm font-bold text-textSecondary">Featured Product</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-textSecondary py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (initial?._id ? 'Save' : 'Create')}
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
  const { products, loading, error, page, pages } = useSelector((s) => s.products);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionErr, setActionErr] = useState('');

  useEffect(() => { dispatch(listProducts({ pageNumber, pageSize: 12 })); }, [dispatch, pageNumber]);

  const refresh = () => dispatch(listProducts({ pageNumber, pageSize: 12 }));

  const handleSave = async (data) => {
    setSaving(true);
    setActionErr('');
    try {
      if (modal?._id) await api.put(`/products/${modal._id}`, data);
      else await api.post('/products', data);
      setModal(null);
      refresh();
    } catch (e) { setActionErr(e.response?.data?.message || e.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); refresh(); }
    catch (e) { setActionErr(e.response?.data?.message || e.message); }
  };

  return (
    <div>
      {modal !== null && (
        <Modal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-textMain">Products</h1>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow">
          <Plus className="h-4 w-4" /> New Product
        </button>
      </div>

      {actionErr && <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-4">{actionErr}</p>}

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="h-10 w-10 text-secondary animate-spin" /></div>
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <>
          <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-textSecondary uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-5 py-3 text-left">Image</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Price</th>
                  <th className="px-5 py-3 text-left">Stock</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-5 py-3">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                        : <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10" />}
                    </td>
                    <td className="px-5 py-3 font-bold text-textMain max-w-[180px] truncate">{p.name}</td>
                    <td className="px-5 py-3 text-textSecondary text-xs font-bold uppercase">{p.category}</td>
                    <td className="px-5 py-3 font-black text-accent">${p.price}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${p.countInStock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {p.countInStock > 0 ? p.countInStock : 'Out'}
                      </span>
                    </td>
                    <td className="px-5 py-3 flex items-center gap-2">
                      <button onClick={() => setModal({ ...p, images: p.images?.join(', ') || '' })}
                        className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-textSecondary px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)}
                        className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                        <Trash2 className="h-3.5 w-3.5" /> Del
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6"><Pagination pages={pages} page={page} keyword="" category="" isAdmin /></div>
        </>
      )}
    </div>
  );
};

export default AdminProductList;
