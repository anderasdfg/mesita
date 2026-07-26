import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { CARTA_CATEGORY_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { Pencil, Trash2, Power } from 'lucide-react';

export const ProductList = React.memo(({ onEdit }) => {
  const { products, toggleProduct, removeProduct, loading } = useOrder();

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-semibold">Nombre</th>
              <th className="text-left p-3 font-semibold">Categoría</th>
              <th className="text-right p-3 font-semibold">Precio</th>
              <th className="text-center p-3 font-semibold">Estado</th>
              <th className="text-center p-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-100 last:border-0">
                <td className="p-3">
                  <div className="font-medium">{product.name}</div>
                  {product.description && (
                    <div className="text-xs text-gray-500">{product.description}</div>
                  )}
                </td>
                <td className="p-3">{CARTA_CATEGORY_LABELS[product.category]}</td>
                <td className="p-3 text-right">{formatCurrency(product.price)}</td>
                <td className="p-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Cambiar estado"
                    >
                      <Power size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

ProductList.displayName = 'ProductList';
