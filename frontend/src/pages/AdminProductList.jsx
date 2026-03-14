import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { listProducts } from '../redux/slices/productSlice';
import api from '../utils/api';
import Pagination from '../components/Pagination';
import { Loader2, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';

const AdminProductList = () => {
  const { pageNumber = 1 } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { products, loading, error, page, pages } = useSelector((state) => state.products);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      navigate('/');
      return;
    }

    dispatch(listProducts({ pageNumber, pageSize: 12 }));
  }, [dispatch, pageNumber, userInfo, navigate]);

  const refresh = () => dispatch(listProducts({ pageNumber, pageSize: 12 }));

  const handleCreate = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await api.post('/products', {
        name: 'New Product',
        description: 'Add product description',
        category: 'uncategorized',
        price: 0,
        countInStock: 0,
      });
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setActionLoading(true);
    setActionError(null);
    try {
      await api.delete(`/products/${id}`);
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (product) => {
    const name = window.prompt('Product name', product.name);
    if (name === null) return;
    const price = window.prompt('Price', product.price);
    if (price === null) return;

    setActionLoading(true);
    setActionError(null);
    try {
      await api.put(`/products/${product._id}`, {
        name,
        price: Number(price),
      });
      refresh();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-textSecondary hover:text-textMain mb-6 transition-colors group font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </button>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-textMain mb-4">
              Admin Dashboard
            </h1>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              type="button"
              onClick={handleCreate}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-dark px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow"
            >
              <Plus className="h-4 w-4" />
              Create Product
            </button>
            {actionError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-xl text-sm">
                {actionError}
              </div>
            )}
          </div>
        </div>

        {loading || actionLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="h-16 w-16 text-secondary animate-spin" />
            <p className="text-textSecondary uppercase tracking-widest font-black text-xs animate-pulse">
              Loading admin panel...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl text-center shadow-xl">
            <p className="font-black uppercase tracking-widest text-sm mb-2">
              Unable to load products
            </p>
            <p className="text-textSecondary text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0A0F1C]/60">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#0A0F1C]/90 text-textSecondary uppercase text-xs tracking-widest">
                  <tr>
                    <th className="px-4 py-4">ID</th>
                    <th className="px-4 py-4">Name</th>
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
                      <td className="px-4 py-4 font-black text-accent">${product.price}</td>
                      <td className="px-4 py-4 font-black text-textSecondary">{product.countInStock}</td>
                      <td className="px-4 py-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center gap-2 bg-[#1E2535] hover:bg-[#2A3348] text-textSecondary px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
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
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
