import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatCurrency } from '../../utils/formatters';
import { Pencil, Trash2, Power } from 'lucide-react';

export const MenuList = React.memo(({ onEdit }) => {
  const { menus, toggleMenu, removeMenu, loading } = useOrder();

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="space-y-4">
      {menus.map(menu => (
        <div key={menu.id} className="bg-white rounded-xl shadow p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{menu.name}</h3>
              <p className="text-blue-600 font-semibold">{formatCurrency(menu.price)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full h-fit ${menu.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
              {menu.active ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-1">Entradas:</p>
              <ul className="list-disc list-inside text-gray-600">
                {(menu.entradaOptions || menu.entradas || []).map(e => <li key={e.id}>{e.name}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Segundos:</p>
              <ul className="list-disc list-inside text-gray-600">
                {(menu.segundoOptions || menu.segundos || []).map(s => <li key={s.id}>{s.name}</li>)}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(menu)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Editar"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => toggleMenu(menu.id)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cambiar estado"
            >
              <Power size={18} />
            </button>
            <button
              type="button"
              onClick={() => removeMenu(menu.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Eliminar"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

MenuList.displayName = 'MenuList';
