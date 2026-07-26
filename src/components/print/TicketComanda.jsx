import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { PRODUCT_TYPE } from '../../utils/constants';
import { calculateCartTotal } from '../../utils/priceCalculator';

const TICKET_LINE = '='.repeat(40);
const DIVIDER_LINE = '-'.repeat(40);

const pad = (str, len, side = 'left') => {
  const text = String(str).substring(0, len);
  return side === 'right' ? text.padStart(len) : text.padEnd(len);
};

const renderItem = (item, idx) => {
  const qty = pad(item.quantity, 4, 'left');
  const name = item.type === PRODUCT_TYPE.MENU
    ? `${item.menuName}\n    ${item.selectedEntrada?.name || ''}\n    ${item.selectedSegundo?.name || ''}`
    : item.productName;
  const subtotal = formatCurrency(item.subtotal).padStart(10);

  return (
    <div key={idx}>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {qty} {name}
      </div>
      {item.notes && (
        <div style={{ marginLeft: '6mm', fontStyle: 'italic', fontSize: '9pt' }}>
          {`>> ${item.notes}`}
        </div>
      )}
      <div style={{ textAlign: 'right' }}>{subtotal}</div>
    </div>
  );
};

export const TicketComanda = React.memo(() => {
  const { tables } = useOrder();
  const printTableId = typeof window !== 'undefined' ? sessionStorage.getItem('printTableId') : null;
  const printTable = printTableId 
    ? tables.find(t => t.id === printTableId)
    : tables.find(t => t.status !== 'libre' && t.order);

  if (!printTable || !printTable.order) {
    return <div id="seccion-ticket" style={{ display: 'none' }} />;
  }

  const { number, order } = printTable;
  const { items, timestamp } = order;
  const total = calculateCartTotal(items);

  return (
    <div id="seccion-ticket" style={{ display: 'none' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>
        ========================================<br />
        RESTAURANTE LUNAHUANA<br />
        ========================================
      </div>

      <div style={{ marginTop: '3mm', marginBottom: '3mm', fontSize: '12px' }}>
        <div>Mesa: {number}          Fecha: {formatDate(timestamp)}</div>
        <div>Mozo: {order.waiter || 'Mozo'}     Hora: {formatTime(timestamp)}</div>
      </div>

      <div>----------------------------------------</div>
      <div style={{ fontWeight: 'bold', fontSize: '11px' }}>
        CANT  DESCRIPCION              PRECIO
      </div>
      <div>----------------------------------------</div>

      {items.map((item, idx) => (
        <div key={idx} style={{ marginTop: '2mm', marginBottom: '2mm', fontSize: '11px' }}>
          <div>
            {item.quantity}x {item.type === PRODUCT_TYPE.MENU 
              ? `${item.menuName}` 
              : item.productName}
          </div>
          {item.type === PRODUCT_TYPE.MENU && (
            <div style={{ paddingLeft: '5mm', fontSize: '10px' }}>
              {item.selectedEntrada?.name}<br />
              {item.selectedSegundo?.name}
            </div>
          )}
          {item.notes && (
            <div style={{ paddingLeft: '5mm', fontStyle: 'italic', fontSize: '10px' }}>
              Nota: {item.notes}
            </div>
          )}
          <div style={{ textAlign: 'right' }}>{formatCurrency(item.subtotal)}</div>
        </div>
      ))}

      <div>----------------------------------------</div>

      <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '14px', marginTop: '3mm' }}>
        TOTAL: {formatCurrency(total)}
      </div>

      <div style={{ textAlign: 'center', marginTop: '5mm', fontSize: '12px' }}>
        ========================================<br />
        Gracias por su visita<br />
        ========================================
      </div>
    </div>
  );
});

TicketComanda.displayName = 'TicketComanda';
