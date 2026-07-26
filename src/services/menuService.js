import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from './storageService';
import { validateMenu } from '../utils/validators';

const STORAGE_KEY = 'menus';

const defaultMenus = [
  {
    id: 'menu-15',
    type: 'MENU',
    name: 'Menú Ejecutivo S/15',
    price: 15.00,
    active: true,
    entradas: [
      { id: 'm15-e1', name: 'Ensalada César' },
      { id: 'm15-e2', name: 'Sopa Criolla' },
      { id: 'm15-e3', name: 'Causa Limeña' }
    ],
    segundos: [
      { id: 'm15-s1', name: 'Pollo a la Brasa' },
      { id: 'm15-s2', name: 'Pescado Frito' },
      { id: 'm15-s3', name: 'Lomo Saltado' },
      { id: 'm15-s4', name: 'Arroz con Pollo' },
      { id: 'm15-s5', name: 'Tallarines Rojos' }
    ],
    createdAt: Date.now()
  },
  {
    id: 'menu-17',
    type: 'MENU',
    name: 'Menú Premium S/17',
    price: 17.00,
    active: true,
    entradas: [
      { id: 'm17-e1', name: 'Papa a la Huancaína' },
      { id: 'm17-e2', name: 'Crema de Espárragos' },
      { id: 'm17-e3', name: 'Ensalada Mixta' }
    ],
    segundos: [
      { id: 'm17-s1', name: 'Pollo a la Plancha' },
      { id: 'm17-s2', name: 'Filete de Pescado' },
      { id: 'm17-s3', name: 'Bistec a lo Pobre' },
      { id: 'm17-s4', name: 'Ceviche Mixto' },
      { id: 'm17-s5', name: 'Arroz Chaufa' }
    ],
    createdAt: Date.now()
  },
  {
    id: 'menu-20',
    type: 'MENU',
    name: 'Menú Especial S/20',
    price: 20.00,
    active: true,
    entradas: [
      { id: 'm20-e1', name: 'Tiradito' },
      { id: 'm20-e2', name: 'Anticuchos' },
      { id: 'm20-e3', name: 'Conchas a la Parmesana' }
    ],
    segundos: [
      { id: 'm20-s1', name: 'Chuletón a la Parrilla' },
      { id: 'm20-s2', name: 'Camarones al Ajillo' },
      { id: 'm20-s3', name: 'Pato a la Naranja' },
      { id: 'm20-s4', name: 'Filete de Salmón' },
      { id: 'm20-s5', name: 'Lomo Saltado Especial' }
    ],
    createdAt: Date.now()
  }
];

const initializeMenus = async () => {
  const menus = await getItem(STORAGE_KEY);
  if (!menus) {
    await setItem(STORAGE_KEY, defaultMenus);
    return defaultMenus;
  }
  return menus;
};

export const getMenus = async (onlyActive = false) => {
  const menus = await initializeMenus();
  if (onlyActive) return menus.filter(menu => menu.active);
  return menus;
};

export const getMenuById = async (id) => {
  const menus = await getMenus();
  return menus.find(menu => menu.id === id) || null;
};

export const createMenu = async (menuData) => {
  const newMenu = {
    ...menuData,
    id: uuidv4(),
    type: 'MENU',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const errors = validateMenu(newMenu);
  if (errors.length > 0) throw new Error(errors.join('. '));

  const menus = await getMenus();
  const updatedMenus = [...menus, newMenu];
  await setItem(STORAGE_KEY, updatedMenus);
  return newMenu;
};

export const updateMenu = async (id, updates) => {
  const menus = await getMenus();
  const index = menus.findIndex(menu => menu.id === id);
  if (index === -1) throw new Error('Menú no encontrado');

  const updatedMenu = {
    ...menus[index],
    ...updates,
    updatedAt: Date.now()
  };

  const errors = validateMenu(updatedMenu);
  if (errors.length > 0) throw new Error(errors.join('. '));

  menus[index] = updatedMenu;
  await setItem(STORAGE_KEY, menus);
  return updatedMenu;
};

export const toggleMenuStatus = async (id) => {
  const menu = await getMenuById(id);
  if (!menu) throw new Error('Menú no encontrado');
  return updateMenu(id, { active: !menu.active });
};

export const deleteMenu = async (id) => {
  const menus = await getMenus();
  const updatedMenus = menus.filter(menu => menu.id !== id);
  await setItem(STORAGE_KEY, updatedMenus);
};
