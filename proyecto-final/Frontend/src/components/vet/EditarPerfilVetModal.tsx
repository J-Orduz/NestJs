import React, { useState, useEffect } from 'react';
import { vetService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface EditarPerfilVetModalProps {
  veterinarioId: string;
  onClose: () => void;
  onPerfilActualizado: () => void;
}

const EditarPerfilVetModal: React.FC<EditarPerfilVetModalProps> = ({ 
  veterinarioId, 
  onClose, 
  onPerfilActualizado 
}) => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_completo: user?.nombre_completo || '',
    correo: user?.correo || '',
    contrasenia: '',
    especialidad_medica: '',
  });

  useEffect(() => {
    // Cargar especialidad médica desde el localStorage o props
    const loadEspecialidad = async () => {
      try {
        // Intentar obtener la especialidad de alguna manera
        setFormData(prev => ({
          ...prev,
          nombre_completo: user?.nombre_completo || '',
          correo: user?.correo || '',
        }));
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEspecialidad();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const updateData: any = {};
    if (formData.nombre_completo && formData.nombre_completo !== user?.nombre_completo) {
      updateData.nombre_completo = formData.nombre_completo;
    }
    if (formData.correo && formData.correo !== user?.correo) {
      updateData.correo = formData.correo;
    }
    if (formData.contrasenia && formData.contrasenia !== '') {
      updateData.contrasenia = formData.contrasenia;
    }
    if (formData.especialidad_medica && formData.especialidad_medica !== '') {
      updateData.especialidad_medica = formData.especialidad_medica;
    }

    if (Object.keys(updateData).length === 0) {
      setError('No se han realizado cambios');
      setSubmitting(false);
      return;
    }

    try {
      await vetService.actualizarPerfil(veterinarioId, updateData);
      
      if (updateData.nombre_completo || updateData.correo) {
        const updatedUser = { ...user, ...updateData } as any;
        const token = localStorage.getItem('token') || '';
        login(updatedUser, token);
      }
      
      setSuccess('Perfil actualizado exitosamente');
      setTimeout(() => {
        onPerfilActualizado();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Editar Perfil</h2>
          <p className="text-sm opacity-90 mt-1">Modifica tus datos profesionales</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad Médica</label>
            <input
              type="text"
              name="especialidad_medica"
              value={formData.especialidad_medica}
              onChange={handleChange}
              placeholder="Ej: Cardiología, Dermatología"
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
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilVetModal;