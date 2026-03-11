import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pages, page, keyword = '', category = '', isAdmin = false }) => {
  return (
    pages > 1 && (
      <div className="flex items-center justify-center gap-2 mt-16">
        {/* Previous Button */}
        <Link
          to={
            page > 1
              ? isAdmin
                ? `/admin/productlist/${page - 1}`
                : keyword
                ? `/search/${keyword}/page/${page - 1}`
                : category
                ? `/category/${category}/page/${page - 1}`
                : `/page/${page - 1}`
              : '#'
          }
          className={`p-3 rounded-xl border border-white/10 transition-all ${
            page > 1 ? 'bg-[#151B28] text-textMain hover:border-accent hover:text-accent' : 'bg-white/5 text-textSecondary cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Page Numbers */}
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={
              isAdmin
                ? `/admin/productlist/${x + 1}`
                : keyword
                ? `/search/${keyword}/page/${x + 1}`
                : category
                ? `/category/${category}/page/${x + 1}`
                : `/page/${x + 1}`
            }
            className={`w-12 h-12 flex items-center justify-center rounded-xl border font-black text-sm transition-all ${
              x + 1 === page
                ? 'bg-primary border-primary text-white shadow-glow'
                : 'bg-[#151B28] border-white/10 text-textSecondary hover:border-accent hover:text-accent'
            }`}
          >
            {x + 1}
          </Link>
        ))}

        {/* Next Button */}
        <Link
          to={
            page < pages
              ? isAdmin
                ? `/admin/productlist/${page + 1}`
                : keyword
                ? `/search/${keyword}/page/${page + 1}`
                : category
                ? `/category/${category}/page/${page + 1}`
                : `/page/${page + 1}`
              : '#'
          }
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
