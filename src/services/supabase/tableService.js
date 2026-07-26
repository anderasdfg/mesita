import { supabase } from '../../lib/supabase';
import { TABLE_STATUS, TABLE_COUNT } from '../../utils/constants';
import { calculateCartTotal } from '../../utils/priceCalculator';

const initializeTables = async () => {
  const { data: existingTables, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .order('number');

  if (error) throw error;

  if (!existingTables || existingTables.length === 0) {
    const defaultTables = Array.from({ length: TABLE_COUNT }, (_, i) => ({
      number: i + 1,
      status: TABLE_STATUS.FREE
    }));

    const { data: newTables, error: insertError } = await supabase
      .from('restaurant_tables')
      .insert(defaultTables)
      .select();

    if (insertError) throw insertError;
    return newTables;
  }

  return existingTables;
};

export const getTables = async () => {
  const tables = await initializeTables();
  
  const { data: orders, error: ordersError } = await supabase
    .from('restaurant_orders')
    .select('*')
    .is('closed_at', null);

  if (ordersError) throw ordersError;

  return tables.map(table => {
    const order = orders?.find(o => o.table_id === table.id);
    return {
      ...table,
      order: order ? {
        items: order.items,
        waiter: order.waiter,
        timestamp: new Date(order.created_at).getTime(),
        updatedAt: new Date(order.updated_at).getTime(),
        total: parseFloat(order.total)
      } : null
    };
  });
};

export const getTableById = async (id) => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const getOccupiedTables = async () => {
  const tables = await getTables();
  return tables.filter(
    table => table.status === TABLE_STATUS.OCCUPIED || table.status === TABLE_STATUS.WAITING_PAYMENT
  );
};

export const updateTableOrder = async (tableId, orderData) => {
  console.log('🔄 updateTableOrder called:', { tableId, orderData });

  const { data: existingOrder, error: fetchError } = await supabase
    .from('restaurant_orders')
    .select('*')
    .eq('table_id', tableId)
    .is('closed_at', null)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const existingItems = existingOrder?.items || [];
  const newItems = orderData.items || [];
  const mergedItems = orderData.replace ? newItems : [...existingItems, ...newItems];
  const total = calculateCartTotal(mergedItems);

  if (existingOrder) {
    const { data: updatedOrder, error: updateError } = await supabase
      .from('restaurant_orders')
      .update({
        items: mergedItems,
        total,
        waiter: orderData.waiter || existingOrder.waiter,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingOrder.id)
      .select()
      .single();

    if (updateError) throw updateError;
  } else {
    const { data: newOrder, error: insertError } = await supabase
      .from('restaurant_orders')
      .insert({
        table_id: tableId,
        items: mergedItems,
        total,
        waiter: orderData.waiter || 'Mozo',
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;
  }

  const { data: updatedTable, error: tableError } = await supabase
    .from('restaurant_tables')
    .update({ status: TABLE_STATUS.OCCUPIED })
    .eq('id', tableId)
    .select()
    .single();

  if (tableError) throw tableError;

  console.log('✅ Table order updated successfully');
  return updatedTable;
};

export const updateTableStatus = async (tableId, status) => {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ status })
    .eq('id', tableId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const closeTable = async (tableId, paymentData) => {
  const { data: order, error: fetchError } = await supabase
    .from('restaurant_orders')
    .select('*')
    .eq('table_id', tableId)
    .is('closed_at', null)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateOrderError } = await supabase
    .from('restaurant_orders')
    .update({
      status: 'completed',
      payment_method: paymentData.method,
      payment_received: parseFloat(paymentData.amountReceived) || 0,
      payment_change: parseFloat(paymentData.change) || 0,
      closed_at: new Date().toISOString()
    })
    .eq('id', order.id);

  if (updateOrderError) throw updateOrderError;

  const { data: updatedTable, error: tableError } = await supabase
    .from('restaurant_tables')
    .update({ status: TABLE_STATUS.FREE })
    .eq('id', tableId)
    .select()
    .single();

  if (tableError) throw tableError;
  return updatedTable;
};

export const resetTables = async () => {
  await supabase.from('restaurant_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const { data, error } = await supabase
    .from('restaurant_tables')
    .update({ status: TABLE_STATUS.FREE })
    .neq('id', '00000000-0000-0000-0000-000000000000')
    .select();

  if (error) throw error;
  return data;
};
