import React, { useState } from 'react';
import { adminService } from '../../services/api';

interface CrearAdminModalProps {
  onClose: () => void;
  onAdminCreado: () => void;
}

const CrearAdminModal: React.FC<CrearAdminModalProps> = ({ onClose, onAdminCreado }) => {
  const [usuarioId, setUsuarioId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.crearAdministrador({ usuario: usuarioId });
      onAdminCreado();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear administrador');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Completar Administrador</h2>
          <p className="text-sm opacity-90">Ingresa el ID del usuario creado</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="text" placeholder="ID del Usuario" onChange={(e) => setUsuarioId(e.target.value)} required
            className="w-full px-4 py-2 border rounded-lg" />
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          <div className="flex space-x-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg">Cancelar</button>
            <button type="submit" disabled={submitting} className="flex-1 bg-primary text-white py-2 rounded-lg">
              {submitting ? 'Creando...' : 'Crear Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearAdminModal;