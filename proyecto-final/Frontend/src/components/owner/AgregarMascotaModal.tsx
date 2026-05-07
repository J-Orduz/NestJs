import React, { useState, useEffect } from 'react';
import { mascotaService, duenioService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AgregarMascotaModalProps {
  onClose: () => void;
  onMascotaAgregada: () => void;
}

const AgregarMascotaModal: React.FC<AgregarMascotaModalProps> = ({ onClose, onMascotaAgregada }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dueñoId, setDueñoId] = useState<string | null>(null);
  const [loadingDueño, setLoadingDueño] = useState(true);
  
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
  });

  useEffect(() => {
    const fetchDueñoId = async () => {
      if (!user?.id) return;
      
      try {
        const dueño = await duenioService.obtenerDueñoPorUsuario(user.id);
        
        if (dueño && dueño.id) {
          setDueñoId(dueño.id);
          console.log('Dueño ID encontrado:', dueño.id);
        } else {
          setError('No se encontró un registro de dueño. Contacta al administrador.');
        }
      } catch (err: any) {
        console.error('Error al obtener el dueño:', err);
        if (err.response?.status === 404) {
          setError('No se encontró un registro de dueño para este usuario. Contacta al administrador.');
        } else {
          setError('Error al cargar la información del dueño');
        }
      } finally {
        setLoadingDueño(false);
      }
    };
    
    fetchDueñoId();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!dueñoId) {
      setError('No se pudo identificar al dueño. Por favor, recarga la página.');
      setSubmitting(false);
      return;
    }

    console.log('Enviando mascota con dueño ID:', dueñoId);

    try {
      await mascotaService.crearMascota({
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        dueño: dueñoId,
      });
      onMascotaAgregada();
      onClose();
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.response?.data?.message || 'Error al agregar la mascota');
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

  if (loadingDueño) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!dueñoId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <div className="text-center">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Agregar Nueva Mascota</h2>
          <p className="text-sm opacity-90 mt-1">Registra una nueva mascota</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Ej: Max"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especie *
            </label>
            <input
              type="text"
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Ej: Perro, Gato, Conejo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raza *
            </label>
            <input
              type="text"
              name="raza"
              value={formData.raza}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Agregando...' : 'Agregar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarMascotaModal;