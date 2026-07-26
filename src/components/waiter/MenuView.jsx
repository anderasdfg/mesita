import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { CategoryFilter } from '../common/CategoryFilter';
import { MenuSelector } from './MenuSelector';
import { PRODUCT_TYPE, CARTA_CATEGORY, CARTA_CATEGORY_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { searchIncludes } from '../../utils/stringUtils';

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
  const [searchTerm, setSearchTerm] = useState('');

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
    let items = [];
    
    // Filtrar por categoría
    if (filter === 'all') {
      items = [...menus, ...products];
    } else if (filter === 'menus') {
      items = menus;
    } else {
      const category = categoryMap[filter];
      items = products.filter(product => product.category === category);
    }
    
    // Filtrar por término de búsqueda (case-insensitive e ignora tildes)
    if (searchTerm.trim()) {
      items = items.filter(item => {
        const name = item.name || '';
        const description = item.description || '';
        return searchIncludes(name, searchTerm) || searchIncludes(description, searchTerm);
      });
    }
    
    return items;
  }, [filter, menus, products, searchTerm]);

  return (
    <div className="pb-28 lg:pb-4">
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
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

        {/* Buscador */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar platos o menús..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Limpiar búsqueda"
            >
              <X className="text-gray-400 hover:text-gray-600" size={20} />
            </button>
          )}
        </div>
      </div>

      <CategoryFilter categories={categories} selected={filter} onSelect={setFilter} />

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-gray-500 mb-2">No se encontraron resultados</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
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
      )}

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
