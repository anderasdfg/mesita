import { useState, useEffect, useCallback } from 'react';
import * as orderService from '../services/orderService';

export const useTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getTables();
      setTables(data);
    } catch (err) {
      setError(err.message || 'Error al cargar mesas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const updateOrder = async (tableId, orderData) => {
    setLoading(true);
    try {
      const updated = await orderService.updateTableOrder(tableId, orderData);
      await fetchTables();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeOrder = async (tableId, paymentData) => {
    setLoading(true);
    try {
      const updated = await orderService.closeTable(tableId, paymentData);
      await fetchTables();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (tableId, status) => {
    setLoading(true);
    try {
      const updated = await orderService.updateTableStatus(tableId, status);
      await fetchTables();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { tables, loading, error, updateOrder, closeOrder, updateStatus, refetch: fetchTables };
};
