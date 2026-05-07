import React, { useState } from 'react';
import type { CitaMedica } from '../../types';
import EditarCitaModal from './EditarCitaModal';
import EliminarCitaModal from './EliminarCitaModal';

interface CitaDetalleModalProps {
  cita: CitaMedica;
  onClose: () => void;
  onCitaActualizada: () => void;
  showActions?: boolean;
}

const CitaDetalleModal: React.FC<CitaDetalleModalProps> = ({ 
  cita, 
  onClose, 
  onCitaActualizada,
  showActions = true 
}) => {
  const [showEditar, setShowEditar] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  const formatFecha = (fechaStr: string) => {
    if (fechaStr.includes(' ')) {
      const [fecha, hora] = fechaStr.split(' ');
      const [year, month, day] = fecha.split('-');
      const fechaObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      return {
        fecha: fechaObj.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        hora: hora.substring(0, 5),
      };
    }
    
    const fecha = new Date(fechaStr);
    return {
      fecha: fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      hora: fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const { fecha, hora } = formatFecha(cita.fecha_cita);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition text-2xl z-10"
          >
            ✕
          </button>

          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-t-2xl p-6 text-white">
            <h2 className="text-2xl font-bold">Detalles de la Cita</h2>
            <p className="text-sm opacity-90 mt-1">ID: {cita.id.slice(0, 8)}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <span className="text-2xl">🐕</span>
              <div>
                <p className="text-sm text-gray-500">Mascota</p>
                <p className="font-semibold text-gray-800">{cita.mascota.nombre}</p>
                <p className="text-sm text-gray-600">
                  {cita.mascota.especie} - {cita.mascota.raza}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Dueño: {cita.mascota.dueño.usuario.nombre_completo}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <span className="text-2xl">👨‍⚕️</span>
              <div>
                <p className="text-sm text-gray-500">Veterinario</p>
                <p className="font-semibold text-gray-800">
                  Dr(a). {cita.veterinario.usuario.nombre_completo}
                </p>
                <p className="text-sm text-gray-600">
                  Especialidad: {cita.veterinario.especialidad_medica}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-sm text-gray-500">Fecha y Hora</p>
                <p className="font-semibold text-gray-800">{fecha}</p>
                <p className="text-sm text-gray-600">Hora: {hora}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 pb-3 border-b border-gray-100">
              <span className="text-2xl">💬</span>
              <div>
                <p className="text-sm text-gray-500">Motivo de Consulta</p>
                <p className="text-gray-800">{cita.motivo_consulta}</p>
              </div>
            </div>

            {/* Botones de acciones - solo se muestran si showActions es true */}
            {showActions && (
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowEditar(true)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => setShowEliminar(true)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showActions && showEditar && (
        <EditarCitaModal
          cita={cita}
          onClose={() => setShowEditar(false)}
          onCitaActualizada={() => {
            onCitaActualizada();
            onClose();
          }}
        />
      )}

      {showActions && showEliminar && (
        <EliminarCitaModal
          citaId={cita.id}
          mascotaNombre={cita.mascota.nombre}
          onClose={() => setShowEliminar(false)}
          onCitaEliminada={() => {
            onCitaActualizada();
            onClose();
          }}
        />
      )}
    </>
  );
};

export default CitaDetalleModal;