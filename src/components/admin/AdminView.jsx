import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ProductList } from './ProductList';
import { MenuList } from './MenuList';
import { ProductForm } from './ProductForm';
import { MenuForm } from './MenuForm';
import { Button } from '../common/Button';

export const AdminView = React.memo(() => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState(1); // 1 for products

  const handleNew = (isProductTab) => {
    setEditingItem(null);
    setIsFormOpen(true);
    setActiveTab(isProductTab ? 1 : 0);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="p-4 pb-28 lg:pb-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl font-bold mb-6">Administración</h1>

      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex gap-2 mb-6 border-b border-gray-200">
          <Tab className={({ selected }) => `
            px-4 py-2 font-medium transition-colors focus:outline-none
            ${selected ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}
          `}>
            Menús
          </Tab>
          <Tab className={({ selected }) => `
            px-4 py-2 font-medium transition-colors focus:outline-none
            ${selected ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-800'}
          `}>
            Platos a la Carta
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="mb-4">
              <Button onClick={() => handleNew(false)}>Nuevo Menú</Button>
            </div>
            <MenuList onEdit={handleEdit} />
          </Tab.Panel>
          <Tab.Panel>
            <div className="mb-4">
              <Button onClick={() => handleNew(true)}>Nuevo Plato</Button>
            </div>
            <ProductList onEdit={handleEdit} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {isFormOpen && activeTab === 0 && (
        <MenuForm item={editingItem} onClose={handleClose} />
      )}

      {isFormOpen && activeTab === 1 && (
        <ProductForm item={editingItem} onClose={handleClose} />
      )}
    </div>
  );
});

AdminView.displayName = 'AdminView';
