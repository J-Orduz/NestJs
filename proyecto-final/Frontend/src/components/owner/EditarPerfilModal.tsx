import React, { useState, useEffect } from 'react';
import { duenioService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import type { Usuario } from '../../types';

interface EditarPerfilModalProps {
  dueñoId: string;
  onClose: () => void;
  onPerfilActualizado: () => void;
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({ dueñoId, onClose, onPerfilActualizado }) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    contrasenia: '',
    direccion_residencia: '',
  });

  // Cargar datos actuales del dueño
  useEffect(() => {
    const fetchDueñoData = async () => {
      try {
        const data = await duenioService.obtenerDueñoActual(dueñoId);
        setFormData({
          nombre_completo: data.usuario?.nombre_completo || '',
          correo: data.usuario?.correo || '',
          contrasenia: '',
          direccion_residencia: data.direccion_residencia || '',
        });
      } catch (err) {
        console.error('Error al cargar datos del dueño:', err);
        setError('Error al cargar los datos del perfil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDueñoData();
  }, [dueñoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Solo enviar campos que no estén vacíos
    const updateData: any = {};
    if (formData.nombre_completo && formData.nombre_completo !== '') {
      updateData.nombre_completo = formData.nombre_completo;
    }
    if (formData.correo && formData.correo !== '') {
      updateData.correo = formData.correo;
    }
    if (formData.contrasenia && formData.contrasenia !== '') {
      updateData.contrasenia = formData.contrasenia;
    }
    if (formData.direccion_residencia && formData.direccion_residencia !== '') {
      updateData.direccion_residencia = formData.direccion_residencia;
    }

    if (Object.keys(updateData).length === 0) {
      setError('No se han realizado cambios');
      setSubmitting(false);
      return;
    }

    try {
      await duenioService.actualizarDueño(dueñoId, updateData);
      
      // Si se actualizó el nombre o correo, actualizar el contexto
      if (updateData.nombre_completo || updateData.correo) {
        const updatedUser = { ...user, ...updateData } as Usuario;
        const token = localStorage.getItem('token') || '';
        login(updatedUser, token);
      }
      
      setSuccess('Perfil actualizado exitosamente');
      setTimeout(() => {
        onPerfilActualizado();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpiar mensajes cuando el usuario empieza a escribir
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl p-6 text-white sticky top-0">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <p className="text-sm opacity-90 mt-1">Modifica tus datos personales</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Tu nombre completo"
            />
            <p className="text-xs text-gray-500 mt-1">Deja en blanco para no cambiar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="tu@email.com"
            />
            <p className="text-xs text-gray-500 mt-1">Deja en blanco para no cambiar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Deja en blanco para mantener la actual</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección de Residencia
            </label>
            <input
              type="text"
              name="direccion_residencia"
              value={formData.direccion_residencia}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Calle 123, Ciudad"
            />
            <p className="text-xs text-gray-500 mt-1">Deja en blanco para no cambiar</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {success}
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
              className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilModal;