import React, { useState } from 'react';
import type { Mascota } from '../../types';
import { mascotaService } from '../../services/api';

interface EditarMascotaModalProps {
  mascota: Mascota;
  onClose: () => void;
  onMascotaActualizada: () => void;
}

const EditarMascotaModal: React.FC<EditarMascotaModalProps> = ({ 
  mascota, 
  onClose, 
  onMascotaActualizada 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: mascota.nombre,
    especie: mascota.especie,
    raza: mascota.raza,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Solo enviar los campos que cambiaron
    const updateData: any = {};
    if (formData.nombre !== mascota.nombre) updateData.nombre = formData.nombre;
    if (formData.especie !== mascota.especie) updateData.especie = formData.especie;
    if (formData.raza !== mascota.raza) updateData.raza = formData.raza;

    if (Object.keys(updateData).length === 0) {
      onClose();
      return;
    }

    try {
      await mascotaService.actualizarMascota(mascota.id, updateData);
      onMascotaActualizada();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la mascota');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Editar Mascota</h2>
          <p className="text-sm opacity-90 mt-1">Modifica los datos de {mascota.nombre}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="Ej: Max"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especie
            </label>
            <input
              type="text"
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="Ej: Perro, Gato, Conejo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raza
            </label>
            <input
              type="text"
              name="raza"
              value={formData.raza}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="Ej: Labrador, Criollo, Persa"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarMascotaModal;