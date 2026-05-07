// src/components/admin/EditarVeterinarioModal.tsx
import React, { useState } from 'react';
import { adminService } from '../../services/api';

interface EditarVeterinarioModalProps {
  vet: any;
  onClose: () => void;
  onVeterinarioActualizado: () => void;
}

const EditarVeterinarioModal: React.FC<EditarVeterinarioModalProps> = ({ vet, onClose, onVeterinarioActualizado }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_completo: vet.usuario?.nombre_completo || '',
    correo: vet.usuario?.correo || '',
    contrasenia: '',
    especialidad_medica: vet.especialidad_medica || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const updateData: any = {};
    if (formData.nombre_completo && formData.nombre_completo !== vet.usuario?.nombre_completo) {
      updateData.nombre_completo = formData.nombre_completo;
    }
    if (formData.correo && formData.correo !== vet.usuario?.correo) {
      updateData.correo = formData.correo;
    }
    if (formData.contrasenia && formData.contrasenia !== '') {
      updateData.contrasenia = formData.contrasenia;
    }
    if (formData.especialidad_medica && formData.especialidad_medica !== vet.especialidad_medica) {
      updateData.especialidad_medica = formData.especialidad_medica;
    }

    if (Object.keys(updateData).length === 0) {
      setError('No se han realizado cambios');
      setSubmitting(false);
      return;
    }

    try {
      await adminService.actualizarVeterinario(vet.id, updateData);
      setSuccess('Veterinario actualizado exitosamente');
      setTimeout(() => {
        onVeterinarioActualizado();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar veterinario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Editar Veterinario</h2>
          <p className="text-sm opacity-90">Modificar datos de {vet.usuario?.nombre_completo}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad Médica</label>
            <input
              type="text"
              name="especialidad_medica"
              value={formData.especialidad_medica}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              placeholder="Dejar en blanco para no cambiar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>}
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition disabled:opacity-50">
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarVeterinarioModal;