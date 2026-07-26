import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_CATEGORIES = [
  'CAMARONES', 'GALLINA', 'CARNES', 'CUYES', 'TRUCHAS', 'PESCADO',
  'RONDA_CRIOLLA', 'CAJA_CHINA', 'PATO', 'POLLOS', 'GASEOSAS',
  'CERVEZAS', 'BEBIDAS', 'GUARNICIONES', 'DESAYUNOS', 'SANDWICH',
  'INFUSIONES', 'JUGOS', 'GALLETAS', 'OTROS'
];

function verifyProducts() {
  console.log('🔍 Verificando productos migrados...\n');
  
  const productsPath = path.join(__dirname, '../src/data/migratedProducts.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  
  let errors = 0;
  let warnings = 0;
  
  console.log(`📦 Total de productos: ${products.length}\n`);
  
  products.forEach((product, index) => {
    if (!product.id) {
      console.error(`❌ Error: Producto #${index + 1} sin ID`);
      errors++;
    }
    
    if (!product.name || product.name.trim() === '') {
      console.error(`❌ Error: Producto #${index + 1} (${product.id}) sin nombre`);
      errors++;
    }
    
    if (typeof product.price !== 'number' || product.price <= 0) {
      console.error(`❌ Error: Producto "${product.name}" (${product.id}) con precio inválido: ${product.price}`);
      errors++;
    }
    
    if (!VALID_CATEGORIES.includes(product.category)) {
      console.error(`❌ Error: Producto "${product.name}" (${product.id}) con categoría inválida: ${product.category}`);
      errors++;
    }
    
    if (product.type !== 'CARTA') {
      console.error(`❌ Error: Producto "${product.name}" (${product.id}) con tipo inválido: ${product.type}`);
      errors++;
    }
    
    if (typeof product.active !== 'boolean') {
      console.warn(`⚠️  Advertencia: Producto "${product.name}" (${product.id}) sin estado activo definido`);
      warnings++;
    }
    
    if (!product.description && product.description !== '') {
      console.warn(`⚠️  Advertencia: Producto "${product.name}" (${product.id}) sin campo descripción`);
      warnings++;
    }
  });
  
  const duplicateIds = products
    .map(p => p.id)
    .filter((id, index, arr) => arr.indexOf(id) !== index);
  
  if (duplicateIds.length > 0) {
    console.error(`❌ Error: IDs duplicados encontrados: ${duplicateIds.join(', ')}`);
    errors += duplicateIds.length;
  }
  
  const duplicateNames = products
    .map(p => p.name.toLowerCase())
    .filter((name, index, arr) => arr.indexOf(name) !== index);
  
  if (duplicateNames.length > 0) {
    console.warn(`⚠️  Advertencia: Nombres duplicados encontrados: ${duplicateNames.length} casos`);
    warnings += duplicateNames.length;
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (errors === 0 && warnings === 0) {
    console.log('✅ ¡Verificación exitosa! No se encontraron problemas.');
  } else {
    if (errors > 0) {
      console.log(`❌ Se encontraron ${errors} error(es) crítico(s)`);
    }
    if (warnings > 0) {
      console.log(`⚠️  Se encontraron ${warnings} advertencia(s)`);
    }
  }
  
  console.log('\n📊 Estadísticas:');
  console.log(`   - Productos totales: ${products.length}`);
  console.log(`   - Productos activos: ${products.filter(p => p.active).length}`);
  console.log(`   - Productos inactivos: ${products.filter(p => !p.active).length}`);
  console.log(`   - Precio promedio: S/ ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}`);
  console.log(`   - Precio mínimo: S/ ${Math.min(...products.map(p => p.price)).toFixed(2)}`);
  console.log(`   - Precio máximo: S/ ${Math.max(...products.map(p => p.price)).toFixed(2)}`);
  
  const withDescription = products.filter(p => p.description && p.description.trim() !== '');
  console.log(`   - Con descripción: ${withDescription.length} (${((withDescription.length / products.length) * 100).toFixed(1)}%)`);
  
  return errors === 0;
}

try {
  const success = verifyProducts();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error('❌ Error durante la verificación:', error);
  process.exit(1);
}
