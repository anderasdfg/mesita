import { getItem, setItem } from './storageService';
import { TABLE_STATUS, TABLE_COUNT } from '../utils/constants';
import { calculateCartTotal } from '../utils/priceCalculator';

const STORAGE_KEY = 'tables';

const initializeTables = async () => {
  const tables = await getItem(STORAGE_KEY);
  if (!tables) {
    const defaultTables = Array.from({ length: TABLE_COUNT }, (_, i) => ({
      id: `table-${i + 1}`,
      number: i + 1,
      status: TABLE_STATUS.FREE,
      order: null,
      createdAt: Date.now()
    }));
    await setItem(STORAGE_KEY, defaultTables);
    return defaultTables;
  }
  return tables;
};

export const getTables = async () => {
  return initializeTables();
};

export const getTableById = async (id) => {
  const tables = await getTables();
  return tables.find(table => table.id === id) || null;
};

export const getOccupiedTables = async () => {
  const tables = await getTables();
  return tables.filter(
    table => table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.WAITING_PAYMENT
  );
};

export const updateTableOrder = async (tableId, orderData) => {
  const tables = await getTables();
  const index = tables.findIndex(table => table.id === tableId);
  if (index === -1) throw new Error('Mesa no encontrada');

  const existingTable = tables[index];
  const existingItems = existingTable.order?.items || [];
  const newItems = orderData.items || [];

  const mergedItems = [...existingItems, ...newItems];
  const total = calculateCartTotal(mergedItems);

  tables[index] = {
    ...existingTable,
    status: TABLE_STATUS.OCCUPIED,
    order: {
      items: mergedItems,
      waiter: orderData.waiter || existingTable.order?.waiter || 'Mozo',
      timestamp: existingTable.order?.timestamp || Date.now(),
      updatedAt: Date.now(),
      total
    }
  };

  await setItem(STORAGE_KEY, tables);
  return tables[index];
};

export const updateTableStatus = async (tableId, status) => {
  const tables = await getTables();
  const index = tables.findIndex(table => table.id === tableId);
  if (index === -1) throw new Error('Mesa no encontrada');

  tables[index].status = status;
  await setItem(STORAGE_KEY, tables);
  return tables[index];
};

export const closeTable = async (tableId, paymentData) => {
  const tables = await getTables();
  const index = tables.findIndex(table => table.id === tableId);
  if (index === -1) throw new Error('Mesa no encontrada');

  tables[index] = {
    ...tables[index],
    status: TABLE_STATUS.FREE,
    order: {
      ...tables[index].order,
      payment: {
        method: paymentData.method,
        amountReceived: parseFloat(paymentData.amountReceived) || 0,
        change: parseFloat(paymentData.change) || 0,
        timestamp: Date.now()
      },
      closedAt: Date.now()
    }
  };

  await setItem(STORAGE_KEY, tables);
  return tables[index];
};

export const resetTables = async () => {
  const defaultTables = Array.from({ length: TABLE_COUNT }, (_, i) => ({
    id: `table-${i + 1}`,
    number: i + 1,
    status: TABLE_STATUS.FREE,
    order: null,
    createdAt: Date.now()
  }));
  await setItem(STORAGE_KEY, defaultTables);
  return defaultTables;
};
