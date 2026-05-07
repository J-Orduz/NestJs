import React, { useState, useEffect } from 'react';
import { mascotaService, vetService } from '../../services/api';

interface AgregarMascotaPorVetModalProps {
  onClose: () => void;
  onMascotaAgregada: () => void;
}

const AgregarMascotaPorVetModal: React.FC<AgregarMascotaPorVetModalProps> = ({ onClose, onMascotaAgregada }) => {
  const [dueños, setDueños] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    dueñoId: '',
  });

  useEffect(() => {
    const fetchDueños = async () => {
      try {
        const data = await vetService.obtenerDueños();
        setDueños(data);
      } catch (err) {
        console.error('Error fetching dueños:', err);
        setError('Error al cargar los dueños');
      } finally {
        setLoading(false);
      }
    };
    fetchDueños();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await mascotaService.crearMascota({
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        dueño: formData.dueñoId,
      });
      setSuccess('Mascota agregada exitosamente');
      setTimeout(() => {
        onMascotaAgregada();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar la mascota');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dueños...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Agregar Mascota</h2>
          <p className="text-sm opacity-90 mt-1">Registra una nueva mascota para un dueño</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dueño *
            </label>
            <select
              name="dueñoId"
              value={formData.dueñoId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="">Selecciona un dueño</option>
              {dueños.map((dueño) => (
                <option key={dueño.id} value={dueño.id}>
                  {dueño.usuario.nombre_completo} - {dueño.direccion_residencia || 'Sin dirección'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Mascota *
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

export default AgregarMascotaPorVetModal;