import React, { useState } from 'react';
import { citaService } from '../../services/api';

interface EliminarCitaModalProps {
  citaId: string;
  mascotaNombre: string;
  onClose: () => void;
  onCitaEliminada: () => void;
}

const EliminarCitaModal: React.FC<EliminarCitaModalProps> = ({ 
  citaId, 
  mascotaNombre, 
  onClose, 
  onCitaEliminada 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setSubmitting(true);
    setError('');

    try {
      await citaService.eliminarCita(citaId);
      onCitaEliminada();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la cita');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Confirmar Eliminación</h2>
          <p className="text-sm opacity-90 mt-1">Esta acción no se puede deshacer</p>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar la cita de <strong>{mascotaNombre}</strong>?
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Eliminando...' : 'Sí, Eliminar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EliminarCitaModal;