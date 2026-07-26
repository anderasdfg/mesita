import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { calculateItemSubtotal } from '../utils/priceCalculator';

const createItem = (item) => ({
  ...item,
  id: uuidv4(),
  subtotal: calculateItemSubtotal(item.unitPrice, item.quantity)
});

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((item) => {
    const newItem = createItem(item);
    console.log('🛒 Adding to cart:', newItem);
    setCartItems(prev => {
      const updated = [...prev, newItem];
      console.log('📦 Cart updated, total items:', updated.length);
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    const qty = Math.max(1, Math.min(99, parseInt(quantity, 10) || 1));
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: qty, subtotal: calculateItemSubtotal(item.unitPrice, qty) }
          : item
      )
    );
  }, []);

  const updateNotes = useCallback((itemId, notes) => {
    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, notes } : item))
    );
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    console.log('🗑️ Clearing cart');
    setCartItems([]);
  }, []);

  const setCartItemsFromOrder = useCallback((items) => {
    setCartItems(items || []);
  }, []);

  return {
    cartItems,
    addToCart,
    updateQuantity,
    updateNotes,
    removeFromCart,
    clearCart,
    setCartItemsFromOrder
  };
};
