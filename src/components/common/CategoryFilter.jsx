import React from 'react';

export const CategoryFilter = React.memo(({
  categories,
  selected,
  onSelect
}) => {
  return (
    <div className="overflow-x-auto scrollbar-hide sticky top-0 bg-gray-50 z-20">
      <div className="flex gap-2 px-4 py-3 snap-x">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`
              px-4 py-2 rounded-full whitespace-nowrap snap-start min-h-[40px]
              transition-colors font-medium text-sm border-2
              ${selected === cat.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';
