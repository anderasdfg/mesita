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

  const menuItems = items.filter(item => item.type === PRODUCT_TYPE.MENU);
  const cartaItems = items.filter(item => item.type === PRODUCT_TYPE.CARTA);

  const menuNames = menuItems.reduce((acc, item) => {
    acc[item.menuName] = (acc[item.menuName] || 0) + item.quantity;
    return acc;
  }, {});
  const entradas = menuItems.reduce((acc, item) => {
    if (item.selectedEntrada?.name) {
      acc[item.selectedEntrada.name] = (acc[item.selectedEntrada.name] || 0) + item.quantity;
    }
    return acc;
  }, {});
  const segundos = menuItems.reduce((acc, item) => {
    if (item.selectedSegundo?.name) {
      acc[item.selectedSegundo.name] = (acc[item.selectedSegundo.name] || 0) + item.quantity;
    }
    return acc;
  }, {});
  const cartas = cartaItems.reduce((acc, item) => {
    acc[item.productName] = (acc[item.productName] || 0) + item.quantity;
    return acc;
  }, {});

  const menuNotes = menuItems.reduce((acc, item) => {
    if (item.notes?.trim()) {
      const entrada = item.selectedEntrada?.name || '';
      const segundo = item.selectedSegundo?.name || '';
      const note = item.notes.trim();
      const key = `${entrada}|${segundo}|${note}`;
      const existing = acc.find(n => n.key === key);
      if (existing) {
        existing.qty += item.quantity;
      } else {
        acc.push({ key, entrada, segundo, note, qty: item.quantity });
      }
    }
    return acc;
  }, []);

  const cartaNotes = cartaItems.reduce((acc, item) => {
    if (item.notes?.trim()) {
      const note = item.notes.trim();
      const key = `${item.productName}|${note}`;
      const existing = acc.find(n => n.key === key);
      if (existing) {
        existing.qty += item.quantity;
      } else {
        acc.push({ key, product: item.productName, note, qty: item.quantity });
      }
    }
    return acc;
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="seccion-ticket-cocina" style={{ display: 'none' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '28px', marginBottom: '3mm' }}>
        COMANDA - COCINA
      </div>

      <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '3mm' }}>
        <div>MESA: {mesaNumber}</div>
        <div>HORA: {formatTime(now)}</div>
      </div>

      <div style={{ borderTop: '4px solid #000', marginBottom: '3mm' }}></div>

      {menuItems.length > 0 && (
        <div style={{ marginBottom: '5mm' }}>
          <div style={{ fontWeight: 'bold', fontSize: '22px', marginBottom: '2mm' }}>MENU</div>
          {Object.keys(entradas).length > 0 && (
            <div style={{ marginBottom: '2mm' }}>
              {Object.entries(entradas).map(([name, qty]) => (
                <div key={name} style={{ fontSize: '22px' }}>
                  {qty}x {name}
                </div>
              ))}
            </div>
          )}
          {Object.keys(segundos).length > 0 && (
            <div>
              {Object.entries(segundos).map(([name, qty]) => (
                <div key={name} style={{ fontSize: '22px' }}>
                  {qty}x {name}
                </div>
              ))}
            </div>
          )}
          {menuNotes.length > 0 && (
            <div style={{ marginTop: '3mm' }}>
              <div style={{ fontWeight: 'bold', fontSize: '22px' }}>NOTAS</div>
              {menuNotes.map((n, idx) => (
                <div>
                  <div key={idx} style={{ fontSize: '15px', fontStyle: 'italic' }}>
                    {n.qty}x {n.entrada} / {n.segundo}
                  </div>
                  <div key={idx} style={{ fontSize: '22px', fontStyle: 'italic' }}>
                     {n.note}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {Object.keys(cartas).length > 0 && (
        <div style={{ marginBottom: '5mm' }}>
          <div style={{ fontWeight: 'bold', fontSize: '22px', marginBottom: '2mm' }}>CARTA</div>
          {Object.entries(cartas).map(([name, qty]) => (
            <div key={name} style={{ fontSize: '22px' }}>
              {qty}x {name}
            </div>
          ))}
          {cartaNotes.length > 0 && (
            <div style={{ marginTop: '3mm' }}>
              <div style={{ fontWeight: 'bold', fontSize: '22px' }}>NOTAS</div>
              {cartaNotes.map((n, idx) => (
                <div key={idx} style={{ fontSize: '22px', fontStyle: 'italic' }}>
                  {n.qty}x {n.product}: {n.note}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ borderTop: '4px solid #000', marginTop: '5mm', paddingTop: '3mm' }}>
        <div style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold' }}>
          Total items: {totalItems}
        </div>
      </div>
    </div>
  );
});

TicketCocina.displayName = 'TicketCocina';
