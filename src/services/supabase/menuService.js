import { supabase } from '../../lib/supabase';

export const getMenus = async (activeOnly = false) => {
  let query = supabase
    .from('restaurant_menus')
    .select('*')
    .order('name');

  if (activeOnly) {
    query = query.eq('available', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map(menu => ({
    ...menu,
    entradaOptions: menu.entrada_options,
    segundoOptions: menu.segundo_options
  }));
};

export const addMenu = async (menu) => {
  const { data, error } = await supabase
    .from('restaurant_menus')
    .insert({
      name: menu.name,
      price: menu.price,
      available: menu.available ?? true,
      entrada_options: menu.entradaOptions,
      segundo_options: menu.segundoOptions
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    entradaOptions: data.entrada_options,
    segundoOptions: data.segundo_options
  };
};

export const updateMenu = async (id, updates) => {
  const { data, error } = await supabase
    .from('restaurant_menus')
    .update({
      name: updates.name,
      price: updates.price,
      available: updates.available,
      entrada_options: updates.entradaOptions,
      segundo_options: updates.segundoOptions,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    entradaOptions: data.entrada_options,
    segundoOptions: data.segundo_options
  };
};

export const toggleMenuAvailability = async (id) => {
  const { data: menu, error: fetchError } = await supabase
    .from('restaurant_menus')
    .select('available')
    .eq('id', id)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('restaurant_menus')
    .update({ 
      available: !menu.available,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    entradaOptions: data.entrada_options,
    segundoOptions: data.segundo_options
  };
};

export const deleteMenu = async (id) => {
  const { error } = await supabase
    .from('restaurant_menus')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
