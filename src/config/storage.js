// Configuración del backend
// Cambia USE_SUPABASE a true para usar Supabase, false para localStorage
export const USE_SUPABASE = true;

// Servicios de productos
export const productService = USE_SUPABASE
  ? import('../services/supabase/productService')
  : import('../services/productService');

// Servicios de menús
export const menuService = USE_SUPABASE
  ? import('../services/supabase/menuService')
  : import('../services/menuService');

// Servicios de mesas/pedidos
export const orderService = USE_SUPABASE
  ? import('../services/supabase/tableService')
  : import('../services/orderService');
