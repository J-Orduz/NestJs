// src/components/admin/CrearVeterinarioModal.tsx
import React, { useState } from 'react';
import { adminService } from '../../services/api';

interface CrearVeterinarioModalProps {
  onClose: () => void;
  onVeterinarioCreado: () => void;
}

const CrearVeterinarioModal: React.FC<CrearVeterinarioModalProps> = ({ onClose, onVeterinarioCreado }) => {
  const [step, setStep] = useState<'usuario' | 'veterinario'>('usuario');
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    contrasenia: '',
    especialidad_medica: '',
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await adminService.crearUsuario({
        nombre_completo: formData.nombre_completo,
        correo: formData.correo,
        contrasenia: formData.contrasenia,
      });
      setUsuarioId(response.id);
      setStep('veterinario');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateVet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await adminService.crearVeterinario({
        especialidad_medica: formData.especialidad_medica,
        usuario: usuarioId,
      });
      onVeterinarioCreado();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear veterinario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (step === 'usuario') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6 text-white">
            <h2 className="text-2xl font-bold">Crear Veterinario</h2>
            <p className="text-sm opacity-90">Paso 1: Datos del usuario</p>
          </div>
          <form onSubmit={handleCreateUser} className="p-6 space-y-4">
            <input
              type="text"
              name="nombre_completo"
              placeholder="Nombre completo"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            <input
              type="password"
              name="contrasenia"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="submit" disabled={submitting} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
                {submitting ? 'Creando...' : 'Siguiente'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Crear Veterinario</h2>
          <p className="text-sm opacity-90">Paso 2: Especialidad médica</p>
        </div>
        <form onSubmit={handleCreateVet} className="p-6 space-y-4">
          <input
            type="text"
            name="especialidad_medica"
            placeholder="Especialidad médica"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="flex space-x-3">
            <button type="button" onClick={() => setStep('usuario')} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Atrás
            </button>
            <button type="submit" disabled={submitting} className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50">
              {submitting ? 'Creando...' : 'Crear Veterinario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearVeterinarioModal;