import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from './storageService';
import { validateProduct } from '../utils/validators';
import { CARTA_CATEGORY } from '../utils/constants';

const STORAGE_KEY = 'products';

const defaultProducts = [
  { id: 'c1', type: 'CARTA', category: CARTA_CATEGORY.CAMARONES, name: 'Ceviche Mixto', price: 25.00, description: 'Pescado, pulpo y camarones', active: true, createdAt: Date.now() },
  { id: 'c2', type: 'CARTA', category: CARTA_CATEGORY.POLLO, name: 'Pollo a la Brasa 1/4', price: 18.00, description: 'Con papas y ensalada', active: true, createdAt: Date.now() },
  { id: 'c3', type: 'CARTA', category: CARTA_CATEGORY.CARNE, name: 'Lomo Fino', price: 32.00, description: 'Con guarnición', active: true, createdAt: Date.now() },
  { id: 'c4', type: 'CARTA', category: CARTA_CATEGORY.PESCADO, name: 'Sudado de Pescado', price: 28.00, description: 'Con yuca y arroz', active: true, createdAt: Date.now() },
  { id: 'c5', type: 'CARTA', category: CARTA_CATEGORY.GALLINA, name: 'Seco de Gallina', price: 22.00, description: 'Con frijoles y arroz', active: true, createdAt: Date.now() },
  { id: 'c6', type: 'CARTA', category: CARTA_CATEGORY.PATO, name: 'Arroz con Pato', price: 30.00, description: 'Estilo norteño', active: true, createdAt: Date.now() },
  { id: 'c7', type: 'CARTA', category: CARTA_CATEGORY.BEBIDAS, name: 'Chicha Morada 1L', price: 8.00, description: 'Natural', active: true, createdAt: Date.now() },
  { id: 'c8', type: 'CARTA', category: CARTA_CATEGORY.BEBIDAS, name: 'Inca Kola 1.5L', price: 6.00, description: '', active: true, createdAt: Date.now() },
  { id: 'c9', type: 'CARTA', category: CARTA_CATEGORY.POLLO, name: 'Pollo al Cilindro', price: 24.00, description: 'Acompañado de papas doradas', active: true, createdAt: Date.now() },
  { id: 'c10', type: 'CARTA', category: CARTA_CATEGORY.CARNE, name: 'Tacu Tacu con Bistec', price: 29.00, description: 'Bistec, huevo y tacu tacu', active: true, createdAt: Date.now() },
  { id: 'c11', type: 'CARTA', category: CARTA_CATEGORY.CAMARONES, name: 'Arroz con Mariscos', price: 35.00, description: 'Para 2 personas', active: true, createdAt: Date.now() },
  { id: 'c12', type: 'CARTA', category: CARTA_CATEGORY.BEBIDAS, name: 'Agua Mineral 500ml', price: 3.00, description: 'Con gas o sin gas', active: true, createdAt: Date.now() }
];

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
