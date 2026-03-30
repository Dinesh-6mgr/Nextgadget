import React, { useEffect, useState } from 'react';
import api from '../../api';
import { Loader2, Trash2, Users, User } from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
    setDeleting('');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-10 w-10 text-secondary animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-textMain">Users</h1>
        <p className="text-textSecondary text-sm mt-1">{users.length} registered users</p>
      </div>

      {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-4">{error}</p>}

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-textSecondary gap-3">
          <Users className="h-12 w-12 opacity-20" />
          <p className="text-sm font-bold">No users found</p>
        </div>
      ) : (
        <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-textSecondary uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-5 py-3 text-left">Avatar</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Joined</th>
                <th className="px-5 py-3 text-left">Cart Items</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-5 py-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                      {u.avatar
                        ? <img src={u.avatar.startsWith('/uploads') ? `${BASE_URL}${u.avatar}` : u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        : <span className="text-xs font-black text-primary uppercase">{u.name?.[0]}</span>
                      }
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-textMain">{u.name}</td>
                  <td className="px-5 py-4 text-textSecondary text-xs">{u.email}</td>
                  <td className="px-5 py-4 text-textSecondary text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-black px-2 py-1 rounded-full bg-white/5 text-textSecondary uppercase tracking-widest">
                      {u.cart?.length ?? 0} items
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={deleting === u._id}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                      {deleting === u._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
