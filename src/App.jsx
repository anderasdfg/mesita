import React, { useMemo } from 'react';
import { OrderProvider, useOrder } from './context/OrderContext';
import { BottomNav } from './components/common/BottomNav';
import { TablesView } from './components/waiter/TablesView';
import { MenuView } from './components/waiter/MenuView';
import { CartView } from './components/waiter/CartView';
import { CashierView } from './components/cashier/CashierView';
import { AdminView } from './components/admin/AdminView';
import { TicketComanda } from './components/print/TicketComanda';
import { TicketCocina } from './components/print/TicketCocina';

const AppContent = React.memo(() => {
  const { activeView, setActiveView } = useOrder();

  const views = useMemo(() => ({
    tables: <TablesView />,
    menu: <MenuView />,
    cart: <CartView />,
    cashier: <CashierView />,
    admin: <AdminView />
  }), []);

  const viewMap = useMemo(() => ['tables', 'cart', 'cashier', 'admin'], []);
  const navIndex = activeView === 'menu' ? 0 : viewMap.indexOf(activeView);

  return (
    <div className="min-h-screen bg-gray-50">
      {views[activeView] || <TablesView />}

      <BottomNav
        activeIndex={navIndex >= 0 ? navIndex : 0}
        onChange={(idx) => setActiveView(viewMap[idx])}
      />

      <TicketComanda />
      <TicketCocina />
    </div>
  );
});

AppContent.displayName = 'AppContent';

function App() {
  return (
    <OrderProvider>
      <AppContent />
    </OrderProvider>
  );
}

export default App;
