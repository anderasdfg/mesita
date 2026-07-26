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

  const entradas = menuItems.reduce((acc, item) => {
    if (item.selectedEntrada?.name) {
      acc[item.selectedEntrada.name] = (acc[item.selectedEntrada.name] || 0) + item.quantity;
    }
    return acc;
  }, {});
  const segundos = menuItems.reduce((acc, item) => {
    if (item.selectedSegundo?.name) {
      const name = item.selectedSegundo.name;
      if (!acc[name]) acc[name] = { qty: 0, notes: {} };
      acc[name].qty += item.quantity;
      if (item.notes?.trim()) {
        const note = item.notes.trim();
        acc[name].notes[note] = (acc[name].notes[note] || 0) + item.quantity;
      }
    }
    return acc;
  }, {});
  const cartaGroups = cartaItems.reduce((acc, item) => {
    const note = item.notes?.trim() || '';
    const key = `${item.productName}|${note}`;
    const existing = acc.find(g => g.key === key);
    if (existing) {
      existing.qty += item.quantity;
    } else {
      acc.push({ key, name: item.productName, note, qty: item.quantity });
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
              {Object.entries(segundos).map(([name, data]) => (
                <div key={name}>
                  <div style={{ fontSize: '22px' }}>
                    {data.qty}x {name}
                  </div>
                  {Object.keys(data.notes).length > 0 && (
                    <div style={{ paddingLeft: '5mm' }}>
                      {Object.entries(data.notes).map(([note]) => (
                        <div key={note} style={{ fontSize: '22px', fontStyle: 'italic' }}>
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {cartaGroups.length > 0 && (
        <div style={{ marginBottom: '5mm' }}>
          <div style={{ fontWeight: 'bold', fontSize: '22px', marginBottom: '2mm' }}>CARTA</div>
          {cartaGroups.map(g => (
            <div key={g.key}>
              <div style={{ fontSize: '22px' }}>
                {g.qty}x {g.name}
              </div>
              {g.note && (
                <div style={{ paddingLeft: '5mm', fontSize: '22px', fontStyle: 'italic' }}>
                  {g.note}
                </div>
              )}
            </div>
          ))}
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
