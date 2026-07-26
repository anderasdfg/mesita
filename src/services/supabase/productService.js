import { supabase } from '../../lib/supabase';

export const getProducts = async (activeOnly = false) => {
  let query = supabase
    .from('restaurant_products')
    .select('*')
    .order('category')
    .order('name');

  if (activeOnly) {
    query = query.eq('available', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('restaurant_products')
    .insert({
      name: product.name,
      category: product.category,
      price: product.price,
      available: product.available ?? true,
      image_url: product.imageUrl
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('restaurant_products')
    .update({
      name: updates.name,
      category: updates.category,
      price: updates.price,
      available: updates.available,
      image_url: updates.imageUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const toggleProductAvailability = async (id) => {
  const { data: product, error: fetchError } = await supabase
    .from('restaurant_products')
    .select('available')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('restaurant_products')
    .update({ 
      available: !product.available,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('restaurant_products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
