import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { vetService } from '../../services/api';
import type { CitaMedica } from '../../types';
import { useNavigate } from 'react-router-dom';
import CitaDetalleModal from '../owner/CitaDetalleModal';
import AgregarMascotaPorVetModal from './AgregarMascotaPorVetModal';
import EditarPerfilVetModal from './EditarPerfilVetModal';

const VetDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [todasLasCitas, setTodasLasCitas] = useState<CitaMedica[]>([]);
  const [misCitas, setMisCitas] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState<CitaMedica | null>(null);
  const [showAgregarMascota, setShowAgregarMascota] = useState(false);
  const [showEditarPerfil, setShowEditarPerfil] = useState(false);
  const [veterinarioId, setVeterinarioId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener todas las citas
      const citasData = await vetService.obtenerMisCitas();
      setTodasLasCitas(citasData);
      
      // Filtrar solo las citas del veterinario actual
      let vetId = veterinarioId;
      
      if (!vetId && citasData.length > 0) {
        // Buscar el ID del veterinario actual en las citas
        for (const cita of citasData) {
          if (cita.veterinario.usuario.id === user?.id) {
            vetId = cita.veterinario.id;
            setVeterinarioId(vetId);
            break;
          }
        }
      }
      
      // Filtrar citas donde el veterinario coincide con el veterinario actual
      const citasFiltradas = citasData.filter(
        (cita) => cita.veterinario.usuario.id === user?.id
      );
      
      setMisCitas(citasFiltradas);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const citasPendientes = misCitas.filter(
    (c) => new Date(c.fecha_cita) >= new Date()
  );
  const citasPasadas = misCitas.filter(
    (c) => new Date(c.fecha_cita) < new Date()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👨‍⚕️</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Panel Veterinario</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.nombre_completo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEditarPerfil(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
              >
                <span>👤</span>
                <span>Mi Perfil</span>
              </button>
              <button
                onClick={() => setShowAgregarMascota(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <span>➕</span>
                <span>Agregar Mascota</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition"
              >
                <span>🚪</span>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <span className="text-2xl mb-2 block">📅</span>
            <p className="text-sm opacity-90">Mis Citas Pendientes</p>
            <p className="text-3xl font-bold">{citasPendientes.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <span className="text-2xl mb-2 block">✅</span>
            <p className="text-sm opacity-90">Citas Completadas</p>
            <p className="text-3xl font-bold">{citasPasadas.length}</p>
          </div>
        </div>

        {/* Citas Pendientes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📅</span>
            Mis Próximas Citas
          </h2>
          {citasPendientes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <span className="text-6xl mb-4 block">📆</span>
              <p className="text-gray-500">No tienes citas pendientes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citasPendientes.map((cita) => (
                <div
                  key={cita.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100 overflow-hidden"
                  onClick={() => setSelectedCita(cita)}
                >
                  <div className="bg-gradient-to-r from-primary to-blue-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-xl">🐾</span>
                      <span className="text-sm bg-white/20 px-2 py-1 rounded">
                        Pendiente
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {cita.mascota.nombre}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <span className="mr-2">🐕</span>
                        <span className="text-sm">Dueño: {cita.mascota.dueño.usuario.nombre_completo}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span className="text-sm">
                          {new Date(cita.fecha_cita).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">🕐</span>
                        <span className="text-sm">
                          {cita.fecha_cita.includes(' ') 
                            ? cita.fecha_cita.split(' ')[1].substring(0, 5)
                            : new Date(cita.fecha_cita).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">💊</span>
                        <span className="text-sm">{cita.motivo_consulta}</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de Citas */}
        {citasPasadas.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">📜</span>
              Historial de Citas
            </h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200">
                {citasPasadas.map((cita) => (
                  <div
                    key={cita.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedCita(cita)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{cita.mascota.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(cita.fecha_cita).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs text-gray-400">
                          Dueño: {cita.mascota.dueño.usuario.nombre_completo}
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">✅ Completada</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      {selectedCita && (
        <CitaDetalleModal
          cita={selectedCita}
          onClose={() => setSelectedCita(null)}
          onCitaActualizada={fetchData}
          showActions={false}
        />
      )}

      {showAgregarMascota && (
        <AgregarMascotaPorVetModal
          onClose={() => setShowAgregarMascota(false)}
          onMascotaAgregada={fetchData}
        />
      )}

      {showEditarPerfil && veterinarioId && (
        <EditarPerfilVetModal
          veterinarioId={veterinarioId}
          onClose={() => setShowEditarPerfil(false)}
          onPerfilActualizado={fetchData}
        />
      )}
    </div>
  );
};

export default VetDashboard;