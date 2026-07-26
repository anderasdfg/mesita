import React, { useRef } from 'react';
import { Printer, Clock } from 'lucide-react';
import { formatCurrency, formatElapsedTime } from '../../utils/formatters';
import { calculateCartTotal } from '../../utils/priceCalculator';
import { PRODUCT_TYPE } from '../../utils/constants';

export const TableCard = React.memo(({ table, onPayment }) => {
  const total = calculateCartTotal(table.order?.items || []);
  const elapsed = table.order?.timestamp ? Date.now() - table.order.timestamp : 0;

  const handlePrint = () => {
    // Guardar el ID de la mesa a imprimir en sessionStorage
    sessionStorage.setItem('printTableId', table.id);
    // Forzar un pequeño delay para que React actualice
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const displayItem = (item) => {
    if (item.type === PRODUCT_TYPE.MENU) {
      return `${item.menuName} - ${item.selectedEntrada.name}, ${item.selectedSegundo.name}`;
    }
    return item.productName;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-2xl font-bold">Mesa {table.number}</h2>
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <Clock size={16} />
          {formatElapsedTime(elapsed)}
        </span>
      </div>

      <div className="mb-4 max-h-32 overflow-y-auto space-y-1">
        {table.order?.items.map((item, idx) => (
          <div key={idx} className="text-sm py-1 border-b border-gray-100 last:border-0">
            <span className="font-medium">{item.quantity}x</span> {displayItem(item)}
          </div>
        ))}
      </div>

      <div className="mb-4 text-right">
        <span className="text-xl font-bold text-blue-600">{formatCurrency(total)}</span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 bg-gray-100 text-gray-800 py-3 rounded-lg flex items-center 
                     justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-transform
                     font-medium min-h-[48px]"
        >
          <Printer size={18} />
          Imprimir
        </button>
        <button
          type="button"
          onClick={onPayment}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium 
                     hover:bg-green-700 active:scale-95 transition-transform min-h-[48px]"
        >
          Cobrar
        </button>
      </div>
    </div>
  );
});

TableCard.displayName = 'TableCard';
