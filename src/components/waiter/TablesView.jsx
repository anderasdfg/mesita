import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { TABLE_STATUS } from '../../utils/constants';

const statusConfig = {
  [TABLE_STATUS.FREE]: { label: 'Libre', className: 'bg-green-100 border-green-500 text-green-800' },
  [TABLE_STATUS.OCCUPIED]: { label: 'Ocupada', className: 'bg-blue-100 border-blue-500 text-blue-800' },
  [TABLE_STATUS.WAITING_PAYMENT]: { label: 'Pago', className: 'bg-yellow-100 border-yellow-500 text-yellow-800' }
};

export const TablesView = React.memo(() => {
  const { tables, selectTable, setActiveView } = useOrder();

  const handleTableClick = (table) => {
    selectTable(table.id);
    setActiveView('menu');
  };

  return (
    <div className="p-4 pb-28 lg:pb-4">
      <h1 className="text-2xl font-bold mb-4">Seleccionar Mesa</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {tables.map(table => {
          const config = statusConfig[table.status] || statusConfig[TABLE_STATUS.FREE];
          return (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`
                aspect-square rounded-xl border-2 flex flex-col items-center justify-center
                transition-all active:scale-95 shadow-sm ${config.className}
              `}
            >
              <span className="text-3xl font-bold">{table.number}</span>
              <span className="text-xs mt-1 font-medium">{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

TablesView.displayName = 'TablesView';
