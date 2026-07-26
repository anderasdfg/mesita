import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useMenus } from '../hooks/useMenus';
import { useProducts } from '../hooks/useProducts';
import { useTables } from '../hooks/useTables';
import { useCart } from '../hooks/useCart';
import { TABLE_STATUS } from '../utils/constants';
import { calculateCartTotal } from '../utils/priceCalculator';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { menus, loading: menusLoading, error: menusError, addMenu, editMenu, toggleMenu, removeMenu, refetch: refetchMenus } = useMenus(true);
  const { products, loading: productsLoading, error: productsError, addProduct, editProduct, toggleProduct, removeProduct, refetch: refetchProducts } = useProducts(true);
  const { tables, loading: tablesLoading, error: tablesError, updateOrder, closeOrder, updateStatus, refetch: refetchTables } = useTables();
  const { cartItems, addToCart, updateQuantity, updateNotes, removeFromCart, clearCart, setCartItemsFromOrder } = useCart();

  const [selectedTable, setSelectedTable] = useState(null);
  const [activeView, setActiveView] = useState('tables');
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  const selectTable = useCallback(async (tableId) => {
    setSelectedTable(tableId);
    setIsEditingOrder(false);
    // Note: cart loading from existing order can be added here if needed
  }, []);

  const editOrder = useCallback((tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (table?.order?.items) {
      setCartItemsFromOrder(table.order.items);
      setSelectedTable(tableId);
      setIsEditingOrder(true);
      setActiveView('cart');
    }
  }, [tables, setCartItemsFromOrder, setActiveView]);

  const cancelEdit = useCallback(() => {
    clearCart();
    setIsEditingOrder(false);
    setSelectedTable(null);
    setActiveView('tables');
  }, [clearCart, setActiveView]);

  const confirmOrder = useCallback(async () => {
    if (!selectedTable || cartItems.length === 0) {
      console.warn('⚠️ Cannot confirm order: no table selected or empty cart');
      return;
    }

    try {
      console.log('📝 Confirming order for table:', selectedTable, 'Items:', cartItems.length, 'Replace:', isEditingOrder);
      await updateOrder(selectedTable, {
        items: cartItems,
        waiter: 'Mozo 1',
        replace: isEditingOrder
      });
      console.log('✅ Order confirmed successfully');
      
      clearCart();
      setIsEditingOrder(false);
      setActiveView('tables');
    } catch (error) {
      console.error('❌ Error confirming order:', error);
      alert('Error al confirmar el pedido. Por favor intenta de nuevo.');
    }
  }, [selectedTable, cartItems, updateOrder, clearCart, setActiveView]);

  const processPayment = useCallback(async (tableId, paymentMethod, amountReceived, total) => {
    const received = parseFloat(amountReceived) || 0;
    const change = received - total;
    await closeOrder(tableId, {
      method: paymentMethod,
      amountReceived: received,
      change: Math.max(0, change)
    });
    clearCart();
    setSelectedTable(null);
  }, [closeOrder, clearCart]);

  const currentTable = useMemo(() => {
    return tables.find(t => t.id === selectedTable) || null;
  }, [tables, selectedTable]);

  const cartTotal = useMemo(() => calculateCartTotal(cartItems), [cartItems]);

  const loading = menusLoading || productsLoading || tablesLoading;
  const error = menusError || productsError || tablesError;

  const value = useMemo(() => ({
    // Data
    menus,
    products,
    tables,
    cartItems,
    selectedTable,
    currentTable,
    activeView,
    loading,
    error,
    // Cart
    cartTotal,
    addToCart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    setCartItemsFromOrder,
    // Navigation
    setActiveView,
    selectTable,
    // Actions
    confirmOrder,
    cancelEdit,
    processPayment,
    editOrder,
    isEditingOrder,
    // Admin
    addProduct,
    editProduct,
    toggleProduct,
    removeProduct,
    refetchProducts,
    addMenu,
    editMenu,
    toggleMenu,
    removeMenu,
    refetchMenus,
    refetchTables,
    updateStatus
  }), [
    menus, products, tables, cartItems, selectedTable, currentTable, activeView, loading, error,
    cartTotal, addToCart, updateQuantity, updateNotes, removeFromCart, clearCart, setCartItemsFromOrder,
    setActiveView, selectTable, confirmOrder, cancelEdit, processPayment, editOrder, isEditingOrder,
    addProduct, editProduct, toggleProduct, removeProduct, refetchProducts,
    addMenu, editMenu, toggleMenu, removeMenu, refetchMenus,
    refetchTables, updateStatus
  ]);

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe usarse dentro de un OrderProvider');
  }
  return context;
};

export { TABLE_STATUS };
