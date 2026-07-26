import { useState, useEffect, useCallback } from 'react';
import * as menuService from '../services/menuService';

export const useMenus = (onlyActive = false) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getMenus(onlyActive);
      setMenus(data);
    } catch (err) {
      setError(err.message || 'Error al cargar menús');
    } finally {
      setLoading(false);
    }
  }, [onlyActive]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const addMenu = async (menuData) => {
    setLoading(true);
    try {
      const newMenu = await menuService.createMenu(menuData);
      await fetchMenus();
      return newMenu;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editMenu = async (id, updates) => {
    setLoading(true);
    try {
      const updated = await menuService.updateMenu(id, updates);
      await fetchMenus();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = async (id) => {
    setLoading(true);
    try {
      const updated = await menuService.toggleMenuStatus(id);
      await fetchMenus();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMenu = async (id) => {
    setLoading(true);
    try {
      await menuService.deleteMenu(id);
      await fetchMenus();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { menus, loading, error, addMenu, editMenu, toggleMenu, removeMenu, refetch: fetchMenus };
};
