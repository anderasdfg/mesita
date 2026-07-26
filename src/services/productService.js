import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from './storageService';
import { validateProduct } from '../utils/validators';
import migratedProductsData from '../data/migratedProducts.json';

const STORAGE_KEY = 'products';

const defaultProducts = migratedProductsData;

const initializeProducts = async () => {
  const products = await getItem(STORAGE_KEY);
  if (!products) {
    await setItem(STORAGE_KEY, defaultProducts);
    return defaultProducts;
  }
  return products;
};

export const getProducts = async (onlyActive = false) => {
  const products = await initializeProducts();
  if (onlyActive) return products.filter(product => product.active);
  return products;
};

export const getProductById = async (id) => {
  const products = await getProducts();
  return products.find(product => product.id === id) || null;
};

export const getProductsByCategory = async (category, onlyActive = true) => {
  const products = await getProducts(onlyActive);
  return products.filter(product => product.category === category);
};

export const createProduct = async (productData) => {
  const newProduct = {
    ...productData,
    id: uuidv4(),
    type: 'CARTA',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const errors = validateProduct(newProduct);
  if (errors.length > 0) throw new Error(errors.join('. '));

  const products = await getProducts();
  const updatedProducts = [...products, newProduct];
  await setItem(STORAGE_KEY, updatedProducts);
  return newProduct;
};

export const updateProduct = async (id, updates) => {
  const products = await getProducts();
  const index = products.findIndex(product => product.id === id);
  if (index === -1) throw new Error('Plato no encontrado');

  const updatedProduct = {
    ...products[index],
    ...updates,
    updatedAt: Date.now()
  };

  const errors = validateProduct(updatedProduct);
  if (errors.length > 0) throw new Error(errors.join('. '));

  products[index] = updatedProduct;
  await setItem(STORAGE_KEY, products);
  return updatedProduct;
};

export const toggleProductStatus = async (id) => {
  const product = await getProductById(id);
  if (!product) throw new Error('Plato no encontrado');
  return updateProduct(id, { active: !product.active });
};

export const deleteProduct = async (id) => {
  const products = await getProducts();
  const updatedProducts = products.filter(product => product.id !== id);
  await setItem(STORAGE_KEY, updatedProducts);
};
