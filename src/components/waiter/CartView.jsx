import React, { useState } from 'react';
import { Printer, Plus, Trash2, Clock, Pencil, X, ChefHat, RefreshCw } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { Button } from '../common/Button';
import { formatCurrency, formatElapsedTime } from '../../utils/formatters';
import { calculateCartTotal } from '../../utils/priceCalculator';
import { PRODUCT_TYPE, TABLE_STATUS } from '../../utils/constants';

export const CartView = React.memo(() => {
  const { tables, setActiveView, selectTable, cartItems, confirmOrder, selectedTable, currentTable, updateQuantity, removeFromCart, updateNotes, editOrder, cancelEdit, isEditingOrder } = useOrder();
  const [expandedTable, setExpandedTable] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

  console.log('🔍 CartView - Cart items:', cartItems.length, 'Selected table:', selectedTable);
  console.log('📋 All tables:', tables.map(t => ({ id: t.id, number: t.number, status: t.status, hasOrder: !!t.order })));

  // Obtener todas las mesas con pedidos activos
  const activeTables = tables.filter(
    table => table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.WAITING_PAYMENT
  );

  console.log('✅ Active tables:', activeTables.length, activeTables.map(t => ({ number: t.number, status: t.status })));

  const total = calculateCartTotal(cartItems);
  const canConfirm = selectedTable && cartItems.length > 0;

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

  const handleEditOrder = (table) => {
    editOrder(table.id);
  };

  const handleAddMore = () => {
    setActiveView('menu');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const displayItem = (item) => {
    if (item.type === PRODUCT_TYPE.MENU) {
      return `${item.menuName} - ${item.selectedEntrada.name}, ${item.selectedSegundo.name}`;
    }
    return item.productName;
  };

  // Si hay items en el carrito, mostrar el carrito temporal
  if (cartItems.length > 0) {
    return (
      <div className="flex flex-col h-screen pb-24">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {isEditingOrder ? 'Editar Pedido' : 'Pedido Actual'}
              </h1>
              {isEditingOrder && (
                <p className="text-xs text-blue-600 font-medium mt-1">Modo edición</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditingOrder && (
                <button
                  onClick={cancelEdit}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Cancelar edición"
                >
                  <X size={20} />
                </button>
              )}
              <span className="text-lg font-medium text-gray-600">
                Mesa {currentTable?.number || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {cartItems.map(item => {
              const displayName = item.type === PRODUCT_TYPE.MENU
                ? `${item.menuName}: ${item.selectedEntrada.name} + ${item.selectedSegundo.name}`
                : item.productName;

              return (
                <div key={item.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="font-semibold text-sm">{displayName}</h3>
                      <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)} c/u</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Eliminar item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-lg font-bold">{formatCurrency(item.subtotal)}</span>
                  </div>

                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Nota (ej: sin cebolla)"
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(item.id, e.target.value)}
                      className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed footer with total and button */}
        <div className="border-t bg-white shadow-lg">
          <div className="p-4">
            <div className="bg-gray-50 rounded-xl p-4 mb-10">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
            {isEditingOrder && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleAddMore}
                className="w-full mb-2"
              >
                <Plus size={18} className="inline mr-2" />
                Agregar más items
              </Button>
            )}
            <Button
              variant="success"
              size="lg"
              onClick={confirmOrder}
              disabled={!canConfirm}
              className="w-full"
            >
              {isEditingOrder ? 'Guardar Cambios' : 'Confirmar Pedido'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay items en el carrito, mostrar todos los pedidos confirmados
  return (
    <div className="p-4 pb-32 lg:pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Control de Pedidos</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            title="Actualizar (F5)"
            aria-label="Actualizar"
          >
            <RefreshCw size={20} />
          </button>
          <span className="text-sm text-gray-600">{activeTables.length} mesas activas</span>
        </div>
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
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAddItems(table)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Agregar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditOrder(table)}
                        className="flex items-center justify-center gap-2"
                      >
                        <Pencil size={18} />
                        Editar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePrintKitchen(table)}
                        className="col-span-2 flex items-center justify-center gap-2"
                      >
                        <ChefHat size={18} />
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
