import React from 'react';
import { Trash2 } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { QuantityControl } from '../common/QuantityControl';
import { PRODUCT_TYPE } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const CartItem = React.memo(({ item, readOnly = false }) => {
  const { updateQuantity, updateNotes, removeFromCart } = useOrder();

  const displayName = item.type === PRODUCT_TYPE.MENU
    ? `${item.menuName}: ${item.selectedEntrada.name} + ${item.selectedSegundo.name}`
    : item.productName;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm break-words">{displayName}</h3>
          <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} c/u</p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Eliminar item"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {!readOnly ? (
        <>
          <div className="mb-3">
            <QuantityControl
              value={item.quantity}
              onChange={(newQty) => updateQuantity(item.id, newQty)}
            />
          </div>

          <textarea
            value={item.notes || ''}
            onChange={(e) => updateNotes(item.id, e.target.value)}
            placeholder="Notas especiales (ej: sin cebolla)"
            className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={2}
          />
        </>
      ) : (
        <>
          <div className="mb-3 text-lg font-semibold">
            Cantidad: {item.quantity}
          </div>
          {item.notes && (
            <div className="p-2 bg-gray-100 rounded-lg text-sm italic">
              Nota: {item.notes}
            </div>
          )}
        </>
      )}

      <div className="mt-3 text-right">
        <span className="text-lg font-bold">{formatCurrency(item.subtotal)}</span>
      </div>
    </div>
  );
});

CartItem.displayName = 'CartItem';
