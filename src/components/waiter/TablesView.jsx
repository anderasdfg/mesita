import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { TABLE_STATUS } from '../../utils/constants';

const statusConfig = {
  [TABLE_STATUS.FREE]: { label: 'Libre', className: 'bg-green-100 border-green-500 text-green-800' },
  [TABLE_STATUS.OCCUPIED]: { label: 'Ocupada', className: 'bg-blue-100 border-blue-500 text-blue-800' },
  [TABLE_STATUS.WAITING_PAYMENT]: { label: 'Pago', className: 'bg-yellow-100 border-yellow-500 text-yellow-800' }
};

export const TablesView = React.memo(() => {
  const { tables, selectTable, setActiveView, loading, error } = useOrder();

  const handleTableClick = (table) => {
    console.log('🖱️ Table clicked:', { id: table.id, number: table.number, status: table.status });
    selectTable(table.id);
    console.log('📍 Table selected, navigating to menu');
    setActiveView('menu');
  };

  if (loading) {
    return (
      <div className="p-4 pb-28 lg:pb-4">
        <h1 className="text-2xl font-bold mb-4">Seleccionar Mesa</h1>
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando mesas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-28 lg:pb-4">
        <h1 className="text-2xl font-bold mb-4">Seleccionar Mesa</h1>
        <div className="text-center py-12">
          <p className="text-red-500 font-semibold mb-2">Error al cargar mesas</p>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-500 mt-4">
            Verifica que ejecutaste la migración SQL en Supabase
          </p>
        </div>
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="p-4 pb-28 lg:pb-4">
        <h1 className="text-2xl font-bold mb-4">Seleccionar Mesa</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No hay mesas configuradas</p>
          <p className="text-sm text-gray-600">
            Las mesas se crearán automáticamente al ejecutar la migración SQL
          </p>
        </div>
      </div>
    );
  }

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
