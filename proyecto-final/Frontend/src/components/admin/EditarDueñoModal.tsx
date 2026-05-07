// src/components/admin/EditarDueñoModal.tsx
import React, { useState } from 'react';
import { adminService } from '../../services/api';

interface EditarDueñoModalProps {
  owner: any;
  onClose: () => void;
  onDueñoActualizado: () => void;
}

const EditarDueñoModal: React.FC<EditarDueñoModalProps> = ({ owner, onClose, onDueñoActualizado }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_completo: owner.usuario?.nombre_completo || '',
    correo: owner.usuario?.correo || '',
    contrasenia: '',
    direccion_residencia: owner.direccion_residencia || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const updateData: any = {};
    if (formData.nombre_completo && formData.nombre_completo !== owner.usuario?.nombre_completo) {
      updateData.nombre_completo = formData.nombre_completo;
    }
    if (formData.correo && formData.correo !== owner.usuario?.correo) {
      updateData.correo = formData.correo;
    }
    if (formData.contrasenia && formData.contrasenia !== '') {
      updateData.contrasenia = formData.contrasenia;
    }
    if (formData.direccion_residencia && formData.direccion_residencia !== owner.direccion_residencia) {
      updateData.direccion_residencia = formData.direccion_residencia;
    }

    if (Object.keys(updateData).length === 0) {
      setError('No se han realizado cambios');
      setSubmitting(false);
      return;
    }

    try {
      await adminService.actualizarDueño(owner.id, updateData);
      setSuccess('Dueño actualizado exitosamente');
      setTimeout(() => {
        onDueñoActualizado();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar dueño');
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
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Editar Dueño</h2>
          <p className="text-sm opacity-90">Modificar datos de {owner.usuario?.nombre_completo}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección de Residencia</label>
            <input
              type="text"
              name="direccion_residencia"
              value={formData.direccion_residencia}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">{success}</div>}
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50">
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarDueñoModal;