export const validateName = (name) => {
  return typeof name === 'string' && name.trim().length > 1;
};

export const validatePrice = (price) => {
  const number = parseFloat(price);
  return !Number.isNaN(number) && number >= 0;
};

export const validateQuantity = (quantity) => {
  const number = parseInt(quantity, 10);
  return !Number.isNaN(number) && number >= 1 && number <= 99;
};

export const validateMenu = (menu) => {
  const errors = [];
  if (!validateName(menu.name)) errors.push('El nombre del menú es inválido');
  if (!validatePrice(menu.price)) errors.push('El precio del menú es inválido');
  if (!Array.isArray(menu.entradas) || menu.entradas.length < 1) errors.push('Debe tener al menos una entrada');
  if (!Array.isArray(menu.segundos) || menu.segundos.length < 1) errors.push('Debe tener al menos un segundo');
  return errors;
};

export const validateProduct = (product) => {
  const errors = [];
  if (!validateName(product.name)) errors.push('El nombre del plato es inválido');
  if (!validatePrice(product.price)) errors.push('El precio del plato es inválido');
  return errors;
};
