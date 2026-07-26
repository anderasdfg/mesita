import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { QuantityControl } from '../common/QuantityControl';
import { PRODUCT_TYPE } from '../../utils/constants';
import { v4 as uuidv4 } from 'uuid';

export const MenuSelector = React.memo(({ item, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedEntrada, setSelectedEntrada] = useState(null);
  const [selectedSegundo, setSelectedSegundo] = useState(null);

  const isMenu = item.type === PRODUCT_TYPE.MENU || item.entradaOptions || item.entradas;

  const entradas = item.entradaOptions || item.entradas || [];
  const segundos = item.segundoOptions || item.segundos || [];

  const handleConfirm = () => {
    if (isMenu && (!selectedEntrada || !selectedSegundo)) {
      alert('Debe seleccionar entrada y segundo');
      return;
    }

    const cartItem = isMenu
      ? {
          id: uuidv4(),
          type: PRODUCT_TYPE.MENU,
          menuId: item.id,
          menuName: item.name,
          selectedEntrada,
          selectedSegundo,
          quantity,
          unitPrice: item.price,
          notes,
          subtotal: item.price * quantity
        }
      : {
          id: uuidv4(),
          type: PRODUCT_TYPE.CARTA,
          productId: item.id,
          productName: item.name,
          category: item.category,
          quantity,
          unitPrice: item.price,
          notes,
          subtotal: item.price * quantity
        };

    onConfirm(cartItem);
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <Dialog.Panel className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold mb-4">{item.name}</Dialog.Title>

          {isMenu && (
            <>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Seleccionar Entrada:</label>
                <div className="space-y-2">
                  {entradas.map(entrada => (
                    <button
                      key={entrada.id}
                      type="button"
                      onClick={() => setSelectedEntrada(entrada)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-colors
                        ${selectedEntrada?.id === entrada.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {entrada.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-2">Seleccionar Segundo:</label>
                <div className="space-y-2">
                  {segundos.map(segundo => (
                    <button
                      key={segundo.id}
                      type="button"
                      onClick={() => setSelectedSegundo(segundo)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-colors
                        ${selectedSegundo?.id === segundo.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      {segundo.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block font-semibold mb-2">Cantidad:</label>
            <QuantityControl value={quantity} onChange={setQuantity} />
          </div>

          <div className="mb-6">
            <label className="block font-semibold mb-2">Notas especiales:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: sin cebolla, picante aparte"
              className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 rounded-lg font-medium active:scale-95 transition-transform"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium active:scale-95 transition-transform"
            >
              Agregar al Pedido
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});

MenuSelector.displayName = 'MenuSelector';
