import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoryMap = {
  'CAMARONES': 'CAMARONES',
  'GALLINA': 'GALLINA',
  'CARNES': 'CARNES',
  'CUYES': 'CUYES',
  'TRUCHAS': 'TRUCHAS',
  'PESCADO': 'PESCADO',
  'RONDA CRIOLLA': 'RONDA_CRIOLLA',
  'CAJA CHINA': 'CAJA_CHINA',
  'PATO': 'PATO',
  'POLLOS': 'POLLOS',
  'GASEOSAS': 'GASEOSAS',
  'CERVEZAS': 'CERVEZAS',
  'BEBIDAS': 'BEBIDAS',
  'GUARNICIONES': 'GUARNICIONES',
  'COMBOS DESAYUNO': 'DESAYUNOS',
  'DESAYUNOS': 'DESAYUNOS',
  'SANDWICH': 'SANDWICH',
  'INFUSIONES': 'INFUSIONES',
  'JUGOS': 'JUGOS',
  'GALLETAS': 'GALLETAS',
  'OTROS': 'OTROS'
};

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  
  return values;
}

function processCSV() {
  const csvPath = path.join(__dirname, '../src/platos-completo.xlsx - Sheet 1.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n');
  
  const headers = parseCsvLine(lines[0]);
  const nameIndex = headers.indexOf('name');
  const priceIndex = headers.indexOf('price');
  const descriptionIndex = headers.indexOf('description');
  const categoryNameIndex = headers.findIndex(h => h === 'categories/0/name');
  const activeIndex = headers.indexOf('active');
  
  const products = [];
  const menuProducts = [];
  let idCounter = 1;
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCsvLine(lines[i]);
    const name = values[nameIndex]?.trim();
    const price = parseFloat(values[priceIndex]);
    const description = values[descriptionIndex]?.trim() || '';
    const categoryName = values[categoryNameIndex]?.toUpperCase().trim();
    const active = values[activeIndex] === 'true';
    
    if (!name || isNaN(price) || !categoryName) continue;
    
    if (name.toLowerCase().startsWith('menu ')) {
      menuProducts.push({
        name,
        price,
        description,
        categoryName,
        active
      });
      continue;
    }
    
    const category = categoryMap[categoryName];
    if (!category) {
      console.warn(`⚠️  Categoría no mapeada: "${categoryName}" para plato: "${name}"`);
      continue;
    }
    
    products.push({
      id: `p${idCounter++}`,
      type: 'CARTA',
      category,
      name,
      price,
      description,
      active,
      createdAt: Date.now()
    });
  }
  
  console.log(`✅ Procesados ${products.length} platos a la carta`);
  console.log(`ℹ️  Encontrados ${menuProducts.length} menús (no incluidos en productos)`);
  
  const categoryCounts = {};
  products.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });
  
  console.log('\n📊 Distribución por categoría:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} platos`);
    });
  
  const outputPath = path.join(__dirname, '../src/data/migratedProducts.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
  
  console.log(`\n💾 Productos guardados en: ${outputPath}`);
  console.log(`\n📝 Menús encontrados (para referencia):`);
  menuProducts.slice(0, 10).forEach(m => {
    console.log(`   - ${m.name} (S/ ${m.price})`);
  });
  if (menuProducts.length > 10) {
    console.log(`   ... y ${menuProducts.length - 10} más`);
  }
  
  return products;
}

try {
  processCSV();
  console.log('\n✅ Migración completada exitosamente');
} catch (error) {
  console.error('❌ Error durante la migración:', error);
  process.exit(1);
}
