import { useState, useMemo } from 'react';

interface FilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function NewsSearchFilter({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  placeholder = "キーワードで検索...",
}: FilterProps) {
  return (
    <div className="mb-12 space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className="ri-search-line text-slate-400 text-xl"></i>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/5 transition-all duration-300 shadow-sm"
          placeholder={placeholder}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="ri-close-circle-fill text-xl"></i>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button
          onClick={() => onCategoryChange('すべて')}
          className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
            activeCategory === 'すべて'
              ? 'bg-[#FF6B00] text-white shadow-[0_4px_15px_rgba(255,107,0,0.3)]'
              : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-[#FF6B00]/30 hover:bg-[#FF6B00]/5'
          }`}
        >
          すべて
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wider transition-all duration-300 ${
              activeCategory === category
                ? 'bg-[#FF6B00] text-white shadow-[0_4px_15px_rgba(255,107,0,0.3)]'
                : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-[#FF6B00]/30 hover:bg-[#FF6B00]/5'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
