import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pages, page, keyword = '', category = '', isAdmin = false }) => {
  const getUrl = (p) => {
    if (isAdmin) return `/admin/products/page/${p}`;
    if (keyword) return `/search/${keyword}/page/${p}`;
    if (category) return `/category/${category}/page/${p}`;
    return `/shop/page/${p}`;
  };
  return (
    pages > 1 && (
      <div className="flex items-center justify-center gap-2 mt-16">
        <Link
          to={page > 1 ? getUrl(page - 1) : '#'}
          className={`p-3 rounded-xl border border-white/10 transition-all ${
            page > 1 ? 'bg-[#151B28] text-textMain hover:border-accent hover:text-accent' : 'bg-white/5 text-textSecondary cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={getUrl(x + 1)}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border font-black text-sm transition-all ${
              x + 1 === page
                ? 'bg-primary border-primary text-white shadow-glow'
                : 'bg-[#151B28] border-white/10 text-textSecondary hover:border-accent hover:text-accent'
            }`}
          >
            {x + 1}
          </Link>
        ))}

        <Link
          to={page < pages ? getUrl(page + 1) : '#'}
          className={`p-3 rounded-xl border border-white/10 transition-all ${
            page < pages ? 'bg-[#151B28] text-textMain hover:border-accent hover:text-accent' : 'bg-white/5 text-textSecondary cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    )
  );
};

export default Pagination;
