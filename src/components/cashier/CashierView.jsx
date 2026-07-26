import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { TableCard } from './TableCard';
import { TABLE_STATUS, PAYMENT_METHOD } from '../../utils/constants';
import { calculateCartTotal } from '../../utils/priceCalculator';

export const CashierView = React.memo(() => {
  const { tables, processPayment } = useOrder();

  const occupiedTables = tables.filter(
    table => table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.WAITING_PAYMENT
  );

  const handlePassToCashier = (table) => {
    const total = calculateCartTotal(table.order?.items || []);
    processPayment(table.id, PAYMENT_METHOD.CASH, total, total);
  };

  return (
    <div className="p-4 pb-28 lg:pb-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Panel de Caja</h1>

      {occupiedTables.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No hay mesas ocupadas
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {occupiedTables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              onPassToCashier={() => handlePassToCashier(table)}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CashierView.displayName = 'CashierView';
