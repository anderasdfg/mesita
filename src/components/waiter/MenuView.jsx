import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { CategoryFilter } from '../common/CategoryFilter';
import { MenuSelector } from './MenuSelector';
import { PRODUCT_TYPE, CARTA_CATEGORY, CARTA_CATEGORY_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const categoryMap = {
  'all': null,
  'menus': null,
  'pollo': CARTA_CATEGORY.POLLO,
  'carne': CARTA_CATEGORY.CARNE,
  'camarones': CARTA_CATEGORY.CAMARONES,
  'gallina': CARTA_CATEGORY.GALLINA,
  'pato': CARTA_CATEGORY.PATO,
  'pescado': CARTA_CATEGORY.PESCADO,
  'bebidas': CARTA_CATEGORY.BEBIDAS
};

export const MenuView = React.memo(() => {
  const { menus, products, addToCart, setActiveView, currentTable } = useOrder();
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = useMemo(() => [
    { id: 'all', label: 'Todos' },
    { id: 'menus', label: 'Menús' },
    { id: 'pollo', label: 'Pollo' },
    { id: 'carne', label: 'Carne' },
    { id: 'camarones', label: 'Camarones' },
    { id: 'gallina', label: 'Gallina' },
    { id: 'pato', label: 'Pato' },
    { id: 'pescado', label: 'Pescado' },
    { id: 'bebidas', label: 'Bebidas' }
  ], []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return [...menus, ...products];
    if (filter === 'menus') return menus;
    const category = categoryMap[filter];
    return products.filter(product => product.category === category);
  }, [filter, menus, products]);

  return (
    <div className="pb-28 lg:pb-4">
      <div className="p-4 pb-2 flex items-center gap-3">
        <button
          onClick={() => setActiveView('tables')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Volver a mesas"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Menú del Día</h1>
          {currentTable ? (
            <p className="text-sm text-gray-600">Mesa {currentTable.number}</p>
          ) : (
            <p className="text-sm text-orange-600">Sin mesa seleccionada</p>
          )}
        </div>
      </div>

      <CategoryFilter categories={categories} selected={filter} onSelect={setFilter} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
        {filteredItems.map(item => {
          const isMenu = item.type === PRODUCT_TYPE.MENU;
          const categoryLabel = isMenu ? 'Menú' : CARTA_CATEGORY_LABELS[item.category];

          return (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
              <div className="p-3 flex-1">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                  <span className={`text-[10px] uppercase px-2 py-1 rounded-full whitespace-nowrap
                    ${isMenu ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                    {categoryLabel}
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(item.price)}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedItem(item)}
                className="w-full bg-blue-600 text-white py-3 font-medium 
                           active:scale-[0.98] transition-transform hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <MenuSelector
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={(cartItem) => {
            addToCart(cartItem);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
});

MenuView.displayName = 'MenuView';
