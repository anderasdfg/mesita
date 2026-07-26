import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useOrder } from '../../context/OrderContext';
import { Button } from '../common/Button';
import { PAYMENT_METHOD, PAYMENT_METHOD_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { calculateCartTotal, calculateChange } from '../../utils/priceCalculator';

export const PaymentModal = React.memo(({ table, onClose }) => {
  const { processPayment } = useOrder();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.CASH);
  const [amountReceived, setAmountReceived] = useState('');

  const total = calculateCartTotal(table.order?.items || []);
  const change = calculateChange(total, parseFloat(amountReceived) || 0);

  const handleConfirm = async () => {
    if (paymentMethod === PAYMENT_METHOD.CASH && change < 0) {
      alert('Monto recibido insuficiente');
      return;
    }

    await processPayment(table.id, paymentMethod, amountReceived, total);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl max-w-md w-full p-6">
          <Dialog.Title className="text-2xl font-bold mb-4">
            Cobrar Mesa {table.number}
          </Dialog.Title>

          <div className="mb-6">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-2xl font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <label className="block font-semibold mb-2">Método de Pago:</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.values(PAYMENT_METHOD).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-3 rounded-lg border-2 font-medium capitalize transition-colors
                    ${paymentMethod === method
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  {PAYMENT_METHOD_LABELS[method]}
                </button>
              ))}
            </div>

            {paymentMethod === PAYMENT_METHOD.CASH && (
              <>
                <label className="block font-semibold mb-2">Monto Recibido:</label>
                <input
                  type="number"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  step="0.01"
                />
                {change >= 0 && amountReceived && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between font-semibold">
                      <span>Cambio:</span>
                      <span className="text-green-600">{formatCurrency(change)}</span>
                    </div>
                  </div>
                )}
                {change < 0 && amountReceived && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between font-semibold">
                      <span>Faltante:</span>
                      <span className="text-red-600">{formatCurrency(Math.abs(change))}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button variant="success" onClick={handleConfirm} className="flex-1">
              Finalizar Pago
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});

PaymentModal.displayName = 'PaymentModal';
