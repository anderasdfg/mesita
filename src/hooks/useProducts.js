import { useState, useEffect, useCallback } from 'react';
import * as productService from '../services/supabase/productService';

export const useProducts = (onlyActive = false) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(onlyActive);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, [onlyActive]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (productData) => {
    setLoading(true);
    try {
      const newProduct = await productService.addProduct(productData);
      await fetchProducts();
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id, updates) => {
    setLoading(true);
    try {
      const updated = await productService.updateProduct(id, updates);
      await fetchProducts();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = async (id) => {
    setLoading(true);
    try {
      const updated = await productService.toggleProductAvailability(id);
      await fetchProducts();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, addProduct, editProduct, toggleProduct, removeProduct, refetch: fetchProducts };
};
