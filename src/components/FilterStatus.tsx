'use client';

interface FilterStatusProps {
  dateRange: { startDate: Date; endDate: Date };
  selectedCategories: string[];
  allCategories: string[];
  totalItems: number;
  filteredItems: number;
}

export default function FilterStatus({ 
  dateRange, 
  selectedCategories, 
  allCategories, 
  totalItems, 
  filteredItems 
}: FilterStatusProps) {
  const hasDateFilter = dateRange.startDate || dateRange.endDate;
  const hasCategoryFilter = selectedCategories.length > 0 && selectedCategories.length < allCategories.length;
  const hasAnyFilter = hasDateFilter || hasCategoryFilter;

  if (!hasAnyFilter && filteredItems === totalItems) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-slate-300">
              Showing {filteredItems.toLocaleString()} of {totalItems.toLocaleString()} records
            </span>
          </div>
          
          {hasCategoryFilter && (
            <div className="text-sm text-slate-400">
              • {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
            </div>
          )}
        </div>
        
        {hasAnyFilter && (
          <div className="text-xs text-blue-400">
            Filters applied
          </div>
        )}
      </div>
    </div>
  );
}
