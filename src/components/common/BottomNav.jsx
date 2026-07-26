import React from 'react';
import { Tab } from '@headlessui/react';
import { Users, ShoppingCart, CreditCard, Settings } from 'lucide-react';

const tabs = [
  { id: 'tables', label: 'Mesas', icon: Users },
  { id: 'cart', label: 'Pedido', icon: ShoppingCart },
  { id: 'cashier', label: 'Caja', icon: CreditCard },
  { id: 'admin', label: 'Admin', icon: Settings }
];

export const BottomNav = React.memo(({ activeIndex, onChange }) => {
  return (
    <Tab.Group selectedIndex={activeIndex} onChange={onChange}>
      <Tab.List className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 
                           flex justify-around pb-safe z-50 shadow-lg">
        {tabs.map(tab => (
          <Tab
            key={tab.id}
            className="flex-1 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {({ selected }) => (
              <div className={`flex flex-col items-center gap-1 ${selected ? 'text-blue-600' : 'text-gray-500'}`}>
                <tab.icon size={24} strokeWidth={selected ? 2.5 : 2} />
                <span className="text-xs font-medium">{tab.label}</span>
              </div>
            )}
          </Tab>
        ))}
      </Tab.List>
    </Tab.Group>
  );
});

BottomNav.displayName = 'BottomNav';
