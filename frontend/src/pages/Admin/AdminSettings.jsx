import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../api';
import { fetchSettings } from '../../redux/slices/settingsSlice';
import {
  Loader2, Save, Store, Mail,
  Globe, DollarSign, AlertTriangle, Upload, Trash2,
} from 'lucide-react';

const DEFAULTS = {
  storeName: '', tagline: '', logoUrl: '', faviconUrl: '',
  supportEmail: '', supportPhone: '', address: '',
  instagram: '', twitter: '', facebook: '', whatsapp: '',
  currencySymbol: '$', taxRate: 0, freeShippingThreshold: 0,
  maintenanceMode: false, maintenanceMessage: '',
};

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
      <Icon className="h-4 w-4 text-primary" />
      <h2 className="font-black uppercase tracking-widest text-xs text-textMain">{title}</h2>
    </div>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Field = ({ label, name, value, onChange, type = 'text', placeholder, full }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <label className="block text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1.5">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={type === 'number' ? 'any' : undefined}
      min={type === 'number' ? 0 : undefined}
      className="w-full bg-[#070B14] border border-white/10 rounded-xl py-2.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all placeholder:text-textSecondary/40"
    />
  </div>
);

const AdminSettings = () => {
  const [form, setForm] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState({});
  const dispatch = useDispatch();

  const handleImageUpload = async (field, file) => {
    if (!file) return;
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post(`/admin/settings/upload/${field}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((f) => ({ ...f, [field]: data.url }));
      dispatch(fetchSettings());
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
    setUploading((u) => ({ ...u, [field]: false }));
  };

  const handleImageDelete = async (field) => {
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      await api.delete(`/admin/settings/upload/${field}`);
      setForm((f) => ({ ...f, [field]: '' }));
      dispatch(fetchSettings());
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
    setUploading((u) => ({ ...u, [field]: false }));
  };

  useEffect(() => {
    api.get('/admin/settings')
      .then(({ data }) => setForm({ ...DEFAULTS, ...data }))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api.put('/admin/settings', form);
      dispatch(fetchSettings()); // update Redux so currency etc. reflects immediately
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-10 w-10 text-secondary animate-spin" />
    </div>
  );

  return (
    <form onSubmit={handleSave}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-textMain">Settings</h1>
          <p className="text-textSecondary text-sm mt-1">Manage your store configuration</p>
        </div>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl mb-4">{error}</p>}
      {success && <p className="text-green-400 text-xs font-bold bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl mb-4">Settings saved successfully.</p>}

      <div className="space-y-5">

        {/* Branding */}
        <Section title="Branding" icon={Store}>
          <Field label="Store Name" name="storeName" value={form.storeName} onChange={handleChange} placeholder="NextGadget" />
          <Field label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} placeholder="Future Tech, Right Now." />

          {/* Logo Upload */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1.5">Logo</label>
            <div className="flex items-center gap-4 bg-[#070B14] border border-white/10 rounded-xl p-4">
              {form.logoUrl ? (
                <>
                  <img
                    src={form.logoUrl.startsWith('/uploads') ? `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${form.logoUrl}` : form.logoUrl}
                    alt="logo"
                    className="h-12 w-auto rounded object-contain bg-white/5 p-1"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <span className="flex-1 text-xs text-textSecondary font-bold truncate">{form.logoUrl.split('/').pop()}</span>
                  <button
                    type="button"
                    onClick={() => handleImageDelete('logoUrl')}
                    disabled={uploading.logoUrl}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {uploading.logoUrl ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                    {uploading.logoUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading.logoUrl ? 'Uploading...' : 'Upload Logo'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('logoUrl', e.target.files[0])} />
                  </label>
                  <span className="text-xs text-textSecondary/50">PNG, JPG, SVG up to 5MB</span>
                </>
              )}
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1.5">Favicon</label>
            <div className="flex items-center gap-4 bg-[#070B14] border border-white/10 rounded-xl p-4">
              {form.faviconUrl ? (
                <>
                  <img
                    src={form.faviconUrl.startsWith('/uploads') ? `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${form.faviconUrl}` : form.faviconUrl}
                    alt="favicon"
                    className="h-8 w-8 rounded object-contain bg-white/5 p-1"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <span className="flex-1 text-xs text-textSecondary font-bold truncate">{form.faviconUrl.split('/').pop()}</span>
                  <button
                    type="button"
                    onClick={() => handleImageDelete('faviconUrl')}
                    disabled={uploading.faviconUrl}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {uploading.faviconUrl ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all">
                    {uploading.faviconUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading.faviconUrl ? 'Uploading...' : 'Upload Favicon'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('faviconUrl', e.target.files[0])} />
                  </label>
                  <span className="text-xs text-textSecondary/50">PNG, ICO, SVG up to 5MB</span>
                </>
              )}
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Info" icon={Mail}>
          <Field label="Support Email" name="supportEmail" value={form.supportEmail} onChange={handleChange} type="email" placeholder="support@nextgadget.com" />
          <Field label="Support Phone" name="supportPhone" value={form.supportPhone} onChange={handleChange} placeholder="+1 234 567 890" />
          <Field label="Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Tech Street, City" full />
        </Section>

        {/* Social */}
        <Section title="Social Links" icon={Globe}>
          <Field label="Instagram URL" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
          <Field label="Twitter / X URL" name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://twitter.com/..." />
          <Field label="Facebook URL" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
          <Field label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+1234567890" />
        </Section>

        {/* Store Policies */}
        <Section title="Store Policies" icon={DollarSign}>
          <Field label="Currency Symbol" name="currencySymbol" value={form.currencySymbol} onChange={handleChange} placeholder="$" />
          <Field label="Tax Rate (%)" name="taxRate" value={form.taxRate} onChange={handleChange} type="number" placeholder="0" />
          <Field label="Free Shipping Threshold ($)" name="freeShippingThreshold" value={form.freeShippingThreshold} onChange={handleChange} type="number" placeholder="0 = always free" full />
        </Section>

        {/* Maintenance */}
        <div className="bg-[#0A0F1C] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <h2 className="font-black uppercase tracking-widest text-xs text-textMain">Maintenance Mode</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between cursor-pointer bg-[#070B14] border border-white/10 rounded-xl px-5 py-4">
              <div>
                <p className="font-black text-sm text-textMain">Enable Maintenance Mode</p>
                <p className="text-[10px] text-textSecondary mt-0.5">Shows a banner to all visitors on the storefront</p>
              </div>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${form.maintenanceMode ? 'bg-yellow-500' : 'bg-white/10'}`}>
                <input type="checkbox" name="maintenanceMode" checked={form.maintenanceMode} onChange={handleChange} className="sr-only" />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.maintenanceMode ? 'translate-x-5' : ''}`} />
              </div>
            </label>
            <div>
              <label className="block text-[10px] font-black text-textSecondary uppercase tracking-widest mb-1.5">Maintenance Message</label>
              <input
                type="text"
                name="maintenanceMessage"
                value={form.maintenanceMessage}
                onChange={handleChange}
                placeholder="We'll be back soon!"
                className="w-full bg-[#070B14] border border-white/10 rounded-xl py-2.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all placeholder:text-textSecondary/40"
              />
            </div>
          </div>
        </div>

      </div>
    </form>
  );
};

export default AdminSettings;
