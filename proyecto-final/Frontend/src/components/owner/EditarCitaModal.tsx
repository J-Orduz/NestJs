import React, { useState, useEffect } from 'react';
import type { CitaMedica, Mascota, Veterinario } from '../../types';
import { citaService, mascotaService, veterinarioService } from '../../services/api';

interface EditarCitaModalProps {
  cita: CitaMedica;
  onClose: () => void;
  onCitaActualizada: () => void;
}

const EditarCitaModal: React.FC<EditarCitaModalProps> = ({ cita, onClose, onCitaActualizada }) => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Separar fecha y hora del formato "YYYY-MM-DD HH:MM:SS"
  let fechaOriginal = '';
  let horaOriginal = '09:00';
  
  if (cita.fecha_cita) {
    const partes = cita.fecha_cita.split(' ');
    if (partes.length >= 2) {
      fechaOriginal = partes[0];
      horaOriginal = partes[1].substring(0, 5);
    } else {
      fechaOriginal = cita.fecha_cita.split('T')[0];
      if (cita.fecha_cita.includes('T')) {
        horaOriginal = cita.fecha_cita.split('T')[1].substring(0, 5);
      }
    }
  }
  
  const [formData, setFormData] = useState({
    mascotaId: cita.mascota.id,
    veterinarioId: cita.veterinario.id,
    fecha: fechaOriginal,
    hora: horaOriginal,
    motivo_consulta: cita.motivo_consulta,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mascotasData, veterinariosData] = await Promise.all([
          mascotaService.obtenerMascotas(),
          veterinarioService.obtenerVeterinarios(),
        ]);
        setMascotas(mascotasData);
        setVeterinarios(veterinariosData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Combinar fecha y hora en formato: YYYY-MM-DD HH:MM:SS
    const fechaCompleta = `${formData.fecha} ${formData.hora}:00`;
    
    const fechaOriginalCompleta = cita.fecha_cita.includes('T') 
      ? cita.fecha_cita.replace('T', ' ').substring(0, 19)
      : cita.fecha_cita;

    try {
      const updateData: any = {};
      
      if (formData.mascotaId !== cita.mascota.id) {
        updateData.mascota = formData.mascotaId;
      }
      if (formData.veterinarioId !== cita.veterinario.id) {
        updateData.veterinario = formData.veterinarioId;
      }
      if (fechaCompleta !== fechaOriginalCompleta) {
        updateData.fecha_cita = fechaCompleta;
      }
      if (formData.motivo_consulta !== cita.motivo_consulta) {
        updateData.motivo_consulta = formData.motivo_consulta;
      }

      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      await citaService.actualizarCita(cita.id, updateData);
      onCitaActualizada();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la cita');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];
  
  // Generar opciones de horas (8 AM a 8 PM)
  const horas = [];
  for (let i = 8; i <= 20; i++) {
    const horaFormateada = i.toString().padStart(2, '0');
    horas.push(`${horaFormateada}:00`);
    if (i !== 20) {
      horas.push(`${horaFormateada}:30`);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-t-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Editar Cita</h2>
          <p className="text-sm opacity-90 mt-1">Modifica los datos de la cita</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mascota
            </label>
            <select
              name="mascotaId"
              value={formData.mascotaId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            >
              {mascotas.map((mascota) => (
                <option key={mascota.id} value={mascota.id}>
                  {mascota.nombre} - {mascota.especie} ({mascota.raza})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Veterinario
            </label>
            <select
              name="veterinarioId"
              value={formData.veterinarioId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            >
              {veterinarios.map((veterinario) => (
                <option key={veterinario.id} value={veterinario.id}>
                  Dr(a). {veterinario.usuario.nombre_completo} - {veterinario.especialidad_medica}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                min={today}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <select
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              >
                {horas.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de Consulta
            </label>
            <textarea
              name="motivo_consulta"
              value={formData.motivo_consulta}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
              placeholder="Describe el motivo de la consulta..."
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

export default EditarCitaModal;