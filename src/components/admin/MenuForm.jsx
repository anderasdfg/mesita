import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useOrder } from '../../context/OrderContext';
import { Button } from '../common/Button';
import { validateMenu } from '../../utils/validators';

const emptyOption = { id: '', name: '' };

const createNewOptions = (count) =>
  Array.from({ length: count }, (_, i) => ({ ...emptyOption, tempId: `new-${Date.now()}-${i}` }));

export const MenuForm = React.memo(({ item, onClose }) => {
  const { addMenu, editMenu } = useOrder();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    active: true,
    entradas: createNewOptions(3),
    segundos: createNewOptions(5)
  });
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        price: item.price || '',
        active: item.active !== false,
        entradas: item.entradas?.length ? item.entradas : createNewOptions(3),
        segundos: item.segundos?.length ? item.segundos : createNewOptions(5)
      });
    }
  }, [item]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (section, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((opt, i) =>
        i === index ? { ...opt, name: value, id: opt.id || opt.tempId || `opt-${Date.now()}` } : opt
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSaving(true);

    const cleanOptions = (options) =>
      options
        .filter(opt => opt.name.trim() !== '')
        .map(opt => ({ id: opt.id || `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, name: opt.name.trim() }));

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      entradas: cleanOptions(formData.entradas),
      segundos: cleanOptions(formData.segundos)
    };

    const validationErrors = validateMenu(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaving(false);
      return;
    }

    try {
      if (item) {
        await editMenu(item.id, data);
      } else {
        await addMenu(data);
      }
      onClose();
    } catch (err) {
      setErrors([err.message]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">
            {item ? 'Editar Menú' : 'Nuevo Menú'}
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
              <label className="block font-semibold mb-2">Entradas (mínimo 1)</label>
              {formData.entradas.map((entrada, idx) => (
                <input
                  key={entrada.tempId || entrada.id || idx}
                  type="text"
                  value={entrada.name}
                  onChange={(e) => handleOptionChange('entradas', idx, e.target.value)}
                  placeholder={`Entrada ${idx + 1}`}
                  className="w-full p-2 mb-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              ))}
            </div>

            <div>
              <label className="block font-semibold mb-2">Segundos (mínimo 1)</label>
              {formData.segundos.map((segundo, idx) => (
                <input
                  key={segundo.tempId || segundo.id || idx}
                  type="text"
                  value={segundo.name}
                  onChange={(e) => handleOptionChange('segundos', idx, e.target.value)}
                  placeholder={`Segundo ${idx + 1}`}
                  className="w-full p-2 mb-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="menu-active"
                checked={formData.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="menu-active" className="font-medium">Activo</label>
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

MenuForm.displayName = 'MenuForm';
