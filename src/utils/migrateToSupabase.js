import { supabase } from '../lib/supabase';
import { getItem } from '../services/storageService';

export const migrateLocalStorageToSupabase = async () => {
  try {
    console.log('🔄 Iniciando migración a Supabase...');

    // Migrar productos
    const localProducts = await getItem('products');
    if (localProducts && localProducts.length > 0) {
      console.log(`📦 Migrando ${localProducts.length} productos...`);
      
      const productsToInsert = localProducts.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        available: p.available ?? true,
        image_url: p.imageUrl
      }));

      const { error: productsError } = await supabase
        .from('restaurant_products')
        .insert(productsToInsert);

      if (productsError) {
        console.error('❌ Error migrando productos:', productsError);
      } else {
        console.log('✅ Productos migrados exitosamente');
      }
    }

    // Migrar menús
    const localMenus = await getItem('menus');
    if (localMenus && localMenus.length > 0) {
      console.log(`📋 Migrando ${localMenus.length} menús...`);
      
      const menusToInsert = localMenus.map(m => ({
        name: m.name,
        price: m.price,
        available: m.available ?? true,
        entrada_options: m.entradaOptions,
        segundo_options: m.segundoOptions
      }));

      const { error: menusError } = await supabase
        .from('restaurant_menus')
        .insert(menusToInsert);

      if (menusError) {
        console.error('❌ Error migrando menús:', menusError);
      } else {
        console.log('✅ Menús migrados exitosamente');
      }
    }

    // Migrar mesas
    const localTables = await getItem('tables');
    if (localTables && localTables.length > 0) {
      console.log(`🪑 Migrando ${localTables.length} mesas...`);
      
      // Primero insertar las mesas
      const tablesToInsert = localTables.map(t => ({
        number: t.number,
        status: t.status
      }));

      const { data: insertedTables, error: tablesError } = await supabase
        .from('restaurant_tables')
        .insert(tablesToInsert)
        .select();

      if (tablesError) {
        console.error('❌ Error migrando mesas:', tablesError);
      } else {
        console.log('✅ Mesas migradas exitosamente');

        // Luego migrar los pedidos activos
        const tablesWithOrders = localTables.filter(t => t.order && t.order.items && t.order.items.length > 0);
        if (tablesWithOrders.length > 0) {
          console.log(`📝 Migrando ${tablesWithOrders.length} pedidos activos...`);

          const ordersToInsert = tablesWithOrders.map((localTable, idx) => {
            const supabaseTable = insertedTables.find(st => st.number === localTable.number);
            return {
              table_id: supabaseTable.id,
              items: localTable.order.items,
              total: localTable.order.total || 0,
              waiter: localTable.order.waiter || 'Mozo',
              status: 'pending'
            };
          });

          const { error: ordersError } = await supabase
            .from('restaurant_orders')
            .insert(ordersToInsert);

          if (ordersError) {
            console.error('❌ Error migrando pedidos:', ordersError);
          } else {
            console.log('✅ Pedidos migrados exitosamente');
          }
        }
      }
    }

    console.log('🎉 Migración completada!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return { success: false, error };
  }
};
