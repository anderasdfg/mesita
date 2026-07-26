/**
 * Normaliza un string removiendo tildes/acentos y convirtiéndolo a minúsculas
 * @param {string} str - String a normalizar
 * @returns {string} String normalizado
 */
export const normalizeString = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, ''); // Remueve los diacríticos (tildes)
};

/**
 * Verifica si un string contiene otro, ignorando tildes y mayúsculas
 * @param {string} text - Texto donde buscar
 * @param {string} search - Término de búsqueda
 * @returns {boolean} True si encuentra coincidencia
 */
export const searchIncludes = (text, search) => {
  return normalizeString(text).includes(normalizeString(search));
};
