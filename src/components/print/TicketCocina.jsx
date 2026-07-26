import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatTime } from '../../utils/formatters';
import { PRODUCT_TYPE } from '../../utils/constants';

export const TicketCocina = React.memo(() => {
  const { cartItems, currentTable } = useOrder();

  // Usar items del carrito si hay, sino usar items de la mesa actual
  const items = cartItems.length > 0 ? cartItems : (currentTable?.order?.items || []);
  
  // Siempre renderizar, los estilos CSS controlan cuándo se muestra
  if (items.length === 0) {
    return <div id="seccion-ticket-cocina" style={{ display: 'none' }}>Sin items</div>;
  }

  const now = Date.now();
  const mesaNumber = currentTable?.number || 'Sin asignar';

  return (
    <div id="seccion-ticket-cocina" style={{ display: 'none' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '28px', marginBottom: '3mm' }}>
        COMANDA - COCINA
      </div>

      <div style={{ fontSize: '23px', fontWeight: 'bold', marginBottom: '3mm' }}>
        <div>MESA: {mesaNumber}</div>
        <div>HORA: {formatTime(now)}</div>
      </div>

      <div style={{ borderTop: '4px solid #000', marginBottom: '3mm' }}></div>

      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '5mm', fontSize: '23px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '23px' }}>
            {item.quantity}x {item.type === PRODUCT_TYPE.MENU 
              ? item.menuName 
              : item.productName}
          </div>
          
          {item.type === PRODUCT_TYPE.MENU && (
            <div style={{ paddingLeft: '5mm', fontSize: '23px', marginTop: '1mm' }}>
              <div>• {item.selectedEntrada?.name}</div>
              <div>• {item.selectedSegundo?.name}</div>
            </div>
          )}
          
          {item.notes && (
            <div style={{ 
              paddingLeft: '5mm', 
              fontStyle: 'italic', 
              fontSize: '23px',
              marginTop: '2mm',
              padding: '2mm',
              border: '3px dashed #000'
            }}>
              {item.notes}
            </div>
          )}
        </div>
      ))}

      <div style={{ borderTop: '4px solid #000', marginTop: '5mm', paddingTop: '3mm' }}>
        <div style={{ textAlign: 'center', fontSize: '23px', fontWeight: 'bold' }}>
          Total items: {items.reduce((sum, item) => sum + item.quantity, 0)}
        </div>
      </div>
    </div>
  );
});

TicketCocina.displayName = 'TicketCocina';
