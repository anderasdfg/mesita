import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useOrder } from '../../context/OrderContext';
import { Button } from '../common/Button';
import { CARTA_CATEGORY, CARTA_CATEGORY_LABELS } from '../../utils/constants';
import { validateProduct } from '../../utils/validators';

export const ProductForm = React.memo(({ item, onClose }) => {
  const { addProduct, editProduct } = useOrder();
  const [formData, setFormData] = useState({
    name: '',
    category: CARTA_CATEGORY.POLLO,
    price: '',
    description: '',
    active: true
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || CARTA_CATEGORY.POLLO,
        price: item.price || '',
        description: item.description || '',
        active: item.active !== false
      });
    }
  }, [item]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSaving(true);

    const data = { ...formData, price: parseFloat(formData.price) };
    const validationErrors = validateProduct(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaving(false);
      return;
    }

    try {
      if (item) {
        await editProduct(item.id, data);
      } else {
        await addProduct(data);
      }
      onClose();
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = Object.values(CARTA_CATEGORY).map(key => ({
    value: key,
    label: CARTA_CATEGORY_LABELS[key]
  }));

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {item ? 'Editar Plato' : 'Nuevo Plato'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="product-active"
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="product-active" className="font-medium">Activo</label>
            </div>

            {errors.length > 0 && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {errors.map((err, idx) => <div key={idx}>{err}</div>)}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
});

ProductForm.displayName = 'ProductForm';
