import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { formatTime } from '../../utils/formatters';
import { PRODUCT_TYPE } from '../../utils/constants';

export const TicketCocina = React.memo(() => {
  const { cartItems, currentTable } = useOrder();

  // Usar items del carrito si hay, sino usar items de la mesa actual
  const items = cartItems.length > 0 ? cartItems : (currentTable?.order?.items || []);
  
  console.log('TicketCocina render:', { 
    cartItemsCount: cartItems.length, 
    tableItemsCount: currentTable?.order?.items?.length || 0,
    usingItems: items.length,
    mesa: currentTable?.number 
  });

  // Siempre renderizar, los estilos CSS controlan cuándo se muestra
  if (items.length === 0) {
    return <div id="seccion-ticket-cocina" style={{ display: 'none' }}>Sin items</div>;
  }

  const now = Date.now();
  const mesaNumber = currentTable?.number || 'Sin asignar';

  return (
    <div id="seccion-ticket-cocina" style={{ display: 'none' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px', marginBottom: '5mm' }}>
        COMANDA - COCINA
      </div>

      <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5mm' }}>
        <div>MESA: {mesaNumber}</div>
        <div>HORA: {formatTime(now)}</div>
      </div>

      <div style={{ borderTop: '3px solid #000', marginBottom: '5mm' }}></div>

      {items.map((item, idx) => (
        <div key={idx} style={{ marginBottom: '8mm', fontSize: '18px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '22px' }}>
            {item.quantity}x {item.type === PRODUCT_TYPE.MENU 
              ? item.menuName 
              : item.productName}
          </div>
          
          {item.type === PRODUCT_TYPE.MENU && (
            <div style={{ paddingLeft: '8mm', fontSize: '18px', marginTop: '2mm' }}>
              <div>• {item.selectedEntrada?.name}</div>
              <div>• {item.selectedSegundo?.name}</div>
            </div>
          )}
          
          {item.notes && (
            <div style={{ 
              paddingLeft: '8mm', 
              fontStyle: 'italic', 
              fontSize: '16px',
              marginTop: '3mm',
              padding: '3mm',
              border: '2px dashed #000'
            }}>
              NOTA: {item.notes}
            </div>
          )}
        </div>
      ))}

      <div style={{ borderTop: '3px solid #000', marginTop: '8mm', paddingTop: '5mm' }}>
        <div style={{ textAlign: 'center', fontSize: '16px' }}>
          Total items: {items.reduce((sum, item) => sum + item.quantity, 0)}
        </div>
      </div>
    </div>
  );
});

TicketCocina.displayName = 'TicketCocina';
