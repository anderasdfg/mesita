import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantityControl = React.memo(({
  value,
  onChange,
  min = 1,
  max = 99
}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const handleDecrement = () => {
    if (canDecrement) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (canIncrement) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canDecrement}
        className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-gray-200 
                   hover:bg-gray-300 active:scale-95 disabled:opacity-40 
                   flex items-center justify-center transition-transform"
        aria-label="Disminuir cantidad"
      >
        <Minus size={20} />
      </button>

      <span className="text-xl font-semibold w-12 text-center tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={!canIncrement}
        className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-blue-600 text-white
                   hover:bg-blue-700 active:scale-95 disabled:opacity-40
                   flex items-center justify-center transition-transform"
        aria-label="Aumentar cantidad"
      >
        <Plus size={20} />
      </button>
    </div>
  );
});

QuantityControl.displayName = 'QuantityControl';
