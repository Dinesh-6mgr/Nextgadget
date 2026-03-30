import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Instagram, Twitter, Facebook, MessageCircle,
  Mail, Phone, MapPin, Zap, ArrowRight,
  Smartphone, Laptop, Camera, Watch, Headphones,
} from 'lucide-react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const Footer = () => {
  const {
    storeName, tagline, logoUrl,
    supportEmail, supportPhone, address,
    instagram, twitter, facebook, whatsapp,
  } = useSelector((s) => s.settings);

  const logoSrc = logoUrl
    ? (logoUrl.startsWith('/uploads') ? `${BASE_URL}${logoUrl}` : logoUrl)
    : '/fulllogo.png';

  const socials = [
    { href: instagram, icon: Instagram,      label: 'Instagram', color: 'hover:text-pink-400' },
    { href: twitter,   icon: Twitter,        label: 'Twitter',   color: 'hover:text-sky-400' },
    { href: facebook,  icon: Facebook,       label: 'Facebook',  color: 'hover:text-blue-400' },
    { href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g,'')}` : '',
                       icon: MessageCircle,  label: 'WhatsApp',  color: 'hover:text-green-400' },
  ].filter(s => s.href);

  const categories = [
    { name: 'Mobiles',  icon: Smartphone },
    { name: 'Laptops',  icon: Laptop },
    { name: 'Cameras',  icon: Camera },
    { name: 'Watches',  icon: Watch },
    { name: 'Audio',    icon: Headphones },
  ];

  const quickLinks = [
    { label: 'Home',        to: '/' },
    { label: 'Shop',        to: '/shop' },
    { label: 'My Orders',   to: '/profile' },
    { label: 'Cart',        to: '/cart' },
    { label: 'Profile',     to: '/profile' },
  ];

  return (
    <footer className="bg-[#070B14] border-t border-white/5 mt-20">

      {/* ── newsletter strip ── */}
      <div className="bg-gradient-to-r from-primary/10 via-[#0A0F1C] to-secondary/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-black text-textMain uppercase tracking-tight">Stay in the loop</p>
              <p className="text-textSecondary text-xs">Get the latest deals and new arrivals</p>
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full sm:w-auto gap-2"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 bg-[#0A0F1C] border border-white/10 rounded-xl py-2.5 px-4 text-textMain text-sm focus:outline-none focus:border-primary transition-all placeholder:text-textSecondary/40"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-glow flex items-center gap-2 active:scale-95"
            >
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ── main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <img src={logoSrc} alt={storeName} className="h-9 w-auto" />
              <span className="text-lg font-black uppercase tracking-wider text-textMain">
                {storeName || 'NextGadget'}
              </span>
            </Link>
            <p className="text-textSecondary text-sm leading-relaxed mb-6 italic border-l-2 border-primary/30 pl-3">
              {tagline || 'Future Tech, Right Now.'}
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map(({ href, icon: Icon, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-textSecondary ${color} hover:border-white/20 hover:bg-white/10 transition-all`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-[10px] font-black text-textSecondary uppercase tracking-[0.25em] mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-textSecondary hover:text-textMain text-sm font-bold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* categories */}
          <div>
            <h4 className="text-[10px] font-black text-textSecondary uppercase tracking-[0.25em] mb-5">Categories</h4>
            <ul className="space-y-3">
              {categories.map(({ name, icon: Icon }) => (
                <li key={name}>
                  <Link
                    to={`/shop/category/${name}`}
                    className="text-textSecondary hover:text-textMain text-sm font-bold transition-colors flex items-center gap-2.5 group"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary/50 group-hover:text-primary transition-colors" />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-[10px] font-black text-textSecondary uppercase tracking-[0.25em] mb-5">Contact</h4>
            <ul className="space-y-4">
              {supportEmail && (
                <li>
                  <a href={`mailto:${supportEmail}`} className="flex items-start gap-3 text-textSecondary hover:text-textMain transition-colors group">
                    <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold break-all">{supportEmail}</span>
                  </a>
                </li>
              )}
              {supportPhone && (
                <li>
                  <a href={`tel:${supportPhone}`} className="flex items-start gap-3 text-textSecondary hover:text-textMain transition-colors group">
                    <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold">{supportPhone}</span>
                  </a>
                </li>
              )}
              {address && (
                <li>
                  <div className="flex items-start gap-3 text-textSecondary">
                    <div className="p-1.5 bg-white/5 rounded-lg mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold leading-relaxed">{address}</span>
                  </div>
                </li>
              )}
              {!supportEmail && !supportPhone && !address && (
                <li className="text-textSecondary/40 text-xs font-bold italic">No contact info set</li>
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* ── bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-textSecondary/50 text-xs font-bold">
            © {new Date().getFullYear()} {storeName || 'NextGadget'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
              <Link key={item} to="/" className="text-textSecondary/50 hover:text-textSecondary text-xs font-bold transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
