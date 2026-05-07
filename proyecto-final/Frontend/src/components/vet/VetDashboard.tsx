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
      const citasData = await vetService.obtenerMisCitas();
      setTodasLasCitas(citasData);
      
      let vetId = veterinarioId;
      
      if (!vetId && citasData.length > 0) {
        for (const cita of citasData) {
          if (cita.veterinario.usuario.id === user?.id) {
            vetId = cita.veterinario.id;
            setVeterinarioId(vetId);
            break;
          }
        }
      }
      
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative text-center z-10">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Cargando tu agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-x-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-teal-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                  Panel Veterinario
                </h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.nombre_completo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowEditarPerfil(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mi Perfil</span>
              </button>
              <button
                onClick={() => setShowAgregarMascota(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Agregar Mascota</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105 group"
              >
                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Mis Citas Pendientes</p>
                <p className="text-4xl font-bold">{citasPendientes.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">📅</span>
              </div>
            </div>
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full animate-shimmer"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Citas Completadas</p>
                <p className="text-4xl font-bold">{citasPasadas.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">✅</span>
              </div>
            </div>
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Citas Pendientes */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6 flex items-center">
            <span className="mr-2 text-3xl">📅</span>
            Mis Próximas Citas
          </h2>
          {citasPendientes.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-white/30 shadow-xl">
              <span className="text-7xl mb-4 block animate-float">📆</span>
              <p className="text-gray-500 text-lg">No tienes citas pendientes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {citasPendientes.map((cita, index) => (
                <div
                  key={cita.id}
                  className="card-hover bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedCita(cita)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-r from-primary to-blue-600 p-4 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-2xl animate-pulse">🐾</span>
                      <span className="text-xs bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        Pendiente
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {cita.mascota.nombre}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center text-sm">
                        <span className="mr-2 text-lg">🐕</span>
                        <span>Dueño: {cita.mascota.dueño.usuario.nombre_completo}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2 text-lg">📅</span>
                        <span>
                          {new Date(cita.fecha_cita).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2 text-lg">🕐</span>
                        <span>
                          {cita.fecha_cita.includes(' ') 
                            ? cita.fecha_cita.split(' ')[1].substring(0, 5)
                            : new Date(cita.fecha_cita).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2 text-lg">💊</span>
                        <span className="line-clamp-1">{cita.motivo_consulta}</span>
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2 rounded-xl hover:shadow-md transition-all duration-300 text-sm font-medium group-hover:from-primary/10 group-hover:to-blue-600/10">
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
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent mb-6 flex items-center">
              <span className="mr-2 text-3xl">📜</span>
              Historial de Citas
            </h2>
            <div className="glass rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="divide-y divide-gray-200/50">
                {citasPasadas.map((cita) => (
                  <div
                    key={cita.id}
                    className="p-4 hover:bg-white/30 cursor-pointer transition-all duration-300"
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
                      <span className="text-sm text-green-500 bg-green-50 px-3 py-1 rounded-full">✅ Completada</span>
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