import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from './storageService';
import { validateMenu } from '../utils/validators';

const STORAGE_KEY = 'menus';

const defaultMenus = [
  {
    id: 'menu-20',
    type: 'MENU',
    name: 'Menú S/20',
    price: 20.00,
    active: true,
    entradas: [
      { id: 'm20-e1', name: 'Chupe de Camarones' },
      { id: 'm20-e2', name: 'Tequeños' },
      { id: 'm20-e3', name: 'Huancaína' }
    ],
    segundos: [
      { id: 'm20-s1', name: 'Saltado de Pollo' },
      { id: 'm20-s2', name: 'Chaufa de Pollo' },
      { id: 'm20-s3', name: 'Seco con Frejoles' },
      { id: 'm20-s4', name: 'Sopa Seca de Pollo con Carapulcra' },
      { id: 'm20-s5', name: 'Sopa Seca de Chancho con Carapulcra' },
      { id: 'm20-s6', name: 'Chaufa de Camarones' },
      { id: 'm20-s7', name: 'Trucha Frita' },
      { id: 'm20-s8', name: 'Milanesa de Pollo' },
      { id: 'm20-s9', name: 'Pollo Frito' },
      { id: 'm20-s10', name: 'Chicharrón de Pollo' }
    ],
    createdAt: Date.now()
  },
  {
    id: 'menu-25',
    type: 'MENU',
    name: 'Menú S/25',
    price: 25.00,
    active: true,
    entradas: [
      { id: 'm25-e1', name: 'Chupe de Camarones' },
      { id: 'm25-e2', name: 'Tequeños' },
      { id: 'm25-e3', name: 'Huancaína' }
    ],
    segundos: [
      { id: 'm25-s1', name: 'Sopa Seca de Camarones con Carapulcra' },
      { id: 'm25-s2', name: 'Chicharrón de Trucha' },
      { id: 'm25-s3', name: 'Chicharrón de Camarones' },
      { id: 'm25-s4', name: 'Arroz con Pato' },
      { id: 'm25-s5', name: 'Cuy Frito' },
      { id: 'm25-s6', name: 'Cuy Chactado' },
      { id: 'm25-s7', name: 'Picante de Cuy' }
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
