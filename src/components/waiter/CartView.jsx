import React, { useState } from 'react';
import { Printer, Plus, Trash2, Clock } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { Button } from '../common/Button';
import { formatCurrency, formatElapsedTime } from '../../utils/formatters';
import { calculateCartTotal } from '../../utils/priceCalculator';
import { PRODUCT_TYPE, TABLE_STATUS } from '../../utils/constants';

export const CartView = React.memo(() => {
  const { tables, setActiveView, selectTable } = useOrder();
  const [expandedTable, setExpandedTable] = useState(null);

  console.log('🔍 CartView - Total tables:', tables.length);
  console.log('📋 All tables:', tables.map(t => ({ id: t.id, number: t.number, status: t.status, hasOrder: !!t.order })));

  // Obtener todas las mesas con pedidos activos
  const activeTables = tables.filter(
    table => table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.WAITING_PAYMENT
  );

  console.log('✅ Active tables:', activeTables.length, activeTables.map(t => ({ number: t.number, status: t.status })));

  const handleAddItems = (table) => {
    selectTable(table.id);
    setActiveView('menu');
  };

  const handlePrintKitchen = (table) => {
    selectTable(table.id);
    document.body.classList.add('print-kitchen');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('print-kitchen');
      }, 1000);
    }, 200);
  };

  const displayItem = (item) => {
    if (item.type === PRODUCT_TYPE.MENU) {
      return `${item.menuName} - ${item.selectedEntrada.name}, ${item.selectedSegundo.name}`;
    }
    return item.productName;
  };

  return (
    <div className="p-4 pb-32 lg:pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Control de Pedidos</h1>
        <span className="text-sm text-gray-600">{activeTables.length} mesas activas</span>
      </div>

      {activeTables.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hay pedidos activos</p>
          <Button variant="secondary" onClick={() => setActiveView('tables')}>
            Ver Mesas
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTables.map(table => {
            const total = calculateCartTotal(table.order?.items || []);
            const elapsed = table.order?.timestamp ? Date.now() - table.order.timestamp : 0;
            const isExpanded = expandedTable === table.id;

            return (
              <div key={table.id} className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500">
                {/* Header */}
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedTable(isExpanded ? null : table.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold">Mesa {table.number}</h3>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock size={16} />
                        {formatElapsedTime(elapsed)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{table.order?.items?.length || 0} items</div>
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(total)}</div>
                    </div>
                  </div>
                </div>

                {/* Items expandidos */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="space-y-2 mb-4">
                      {table.order?.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.quantity}x {displayItem(item)}
                            </div>
                            {item.notes && (
                              <div className="text-xs text-gray-500 italic mt-1">Nota: {item.notes}</div>
                            )}
                          </div>
                          <div className="text-sm font-semibold">{formatCurrency(item.subtotal)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddItems(table)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Agregar Items
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePrintKitchen(table)}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Printer size={18} />
                        Imprimir Cocina
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

CartView.displayName = 'CartView';
