'use client';

import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategoryFilter({ categories, selectedCategories, onChange }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onChange(updatedCategories);
  };

  const handleSelectAll = () => {
    onChange(categories);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return 'All Categories';
    } else if (selectedCategories.length === 1) {
      return selectedCategories[0];
    } else if (selectedCategories.length === categories.length) {
      return 'All Categories';
    } else {
      return `${selectedCategories.length} Selected`;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-colors flex items-center gap-2 min-w-[140px]"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
          />
        </svg>
        <span className="flex-1 text-left">{getDisplayText()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-20">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-white">Categories</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    All
                  </button>
                  <span className="text-slate-400">|</span>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    None
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-3 text-sm text-slate-300 hover:text-white cursor-pointer p-2 rounded hover:bg-white/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
