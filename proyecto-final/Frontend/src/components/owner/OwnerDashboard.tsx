import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { citaService, mascotaService } from '../../services/api';
import type { CitaMedica, Mascota } from '../../types';
import { useNavigate } from 'react-router-dom';
import CitaDetalleModal from './CitaDetalleModal';
import AgendarCitaModal from './AgendarCitaModal';
import AgregarMascotaModal from './AgregarMascotaModal';
import EditarMascotaModal from './EditarMascotaModal';
import EliminarMascotaModal from './EliminarMascotaModal';

const OwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [citas, setCitas] = useState<CitaMedica[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCita, setSelectedCita] = useState<CitaMedica | null>(null);
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [showAgregarMascotaModal, setShowAgregarMascotaModal] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null);
  const [showEditarMascota, setShowEditarMascota] = useState(false);
  const [showEliminarMascota, setShowEliminarMascota] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [citasData, mascotasData] = await Promise.all([
        citaService.obtenerCitas(),
        mascotaService.obtenerMascotas(),
      ]);
      
      const misMascotas = mascotasData.filter(
        (m) => m.dueño.usuario.id === user?.id
      );
      setMascotas(misMascotas);
      
      const misMascotasIds = new Set(misMascotas.map((m) => m.id));
      const misCitas = citasData.filter((c) =>
        misMascotasIds.has(c.mascota.id)
      );
      setCitas(misCitas);
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

  const citasPendientes = citas.filter(
    (c) => new Date(c.fecha_cita) >= new Date()
  );
  const citasPasadas = citas.filter(
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
              <span className="text-3xl">🐾</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">PetHealth</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.nombre_completo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAgendarModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
              >
                <span>➕</span>
                <span>Nueva Cita</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <span className="text-2xl mb-2 block">📅</span>
            <p className="text-sm opacity-90">Citas Pendientes</p>
            <p className="text-3xl font-bold">{citasPendientes.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <span className="text-2xl mb-2 block">🐕</span>
            <p className="text-sm opacity-90">Mis Mascotas</p>
            <p className="text-3xl font-bold">{mascotas.length}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <span className="text-2xl mb-2 block">🏥</span>
            <p className="text-sm opacity-90">Total Citas</p>
            <p className="text-3xl font-bold">{citas.length}</p>
          </div>
        </div>

        {/* Sección de Mascotas */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="mr-2">🐕</span>
              Mis Mascotas
            </h2>
            <button
              onClick={() => setShowAgregarMascotaModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Agregar Mascota</span>
            </button>
          </div>

          {mascotas.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <span className="text-6xl mb-4 block">🐕</span>
              <p className="text-gray-500">No tienes mascotas registradas</p>
              <button
                onClick={() => setShowAgregarMascotaModal(true)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Registrar mi primera mascota
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mascotas.map((mascota) => (
                <div
                  key={mascota.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl">🐕</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMascota(mascota);
                            setShowEditarMascota(true);
                          }}
                          className="text-white hover:text-yellow-200 transition"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMascota(mascota);
                            setShowEliminarMascota(true);
                          }}
                          className="text-white hover:text-red-200 transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {mascota.nombre}
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      <p className="text-sm">
                        <span className="font-medium">Especie:</span> {mascota.especie}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Raza:</span> {mascota.raza}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección de Citas Pendientes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📅</span>
            Próximas Citas
          </h2>
          {citasPendientes.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
              <span className="text-6xl mb-4 block">📆</span>
              <p className="text-gray-500">No tienes citas pendientes</p>
              <button
                onClick={() => setShowAgendarModal(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
              >
                Agendar mi primera cita
              </button>
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
                      <div className="flex items-center">
                        <span className="mr-2">👨‍⚕️</span>
                        <span className="text-sm">Dr. {cita.veterinario.usuario.nombre_completo}</span>
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
                          Dr. {cita.veterinario.usuario.nombre_completo}
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
        />
      )}

      {showAgendarModal && (
        <AgendarCitaModal
          onClose={() => setShowAgendarModal(false)}
          onCitaCreada={fetchData}
        />
      )}

      {showAgregarMascotaModal && (
        <AgregarMascotaModal
          onClose={() => setShowAgregarMascotaModal(false)}
          onMascotaAgregada={fetchData}
        />
      )}

      {showEditarMascota && selectedMascota && (
        <EditarMascotaModal
          mascota={selectedMascota}
          onClose={() => {
            setShowEditarMascota(false);
            setSelectedMascota(null);
          }}
          onMascotaActualizada={fetchData}
        />
      )}

      {showEliminarMascota && selectedMascota && (
        <EliminarMascotaModal
          mascotaId={selectedMascota.id}
          mascotaNombre={selectedMascota.nombre}
          onClose={() => {
            setShowEliminarMascota(false);
            setSelectedMascota(null);
          }}
          onMascotaEliminada={fetchData}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;