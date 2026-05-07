import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import CrearUsuarioModal from './CrearUsuarioModal';
import EditarAdminModal from './EditarAdminModal';
import CrearVeterinarioModal from './CrearVeterinarioModal';
import EditarVeterinarioModal from './EditarVeterinarioModal';
import EditarDueñoModal from './EditarDueñoModal';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'admins' | 'vets' | 'owners'>('admins');
  
  // Estados para datos
  const [admins, setAdmins] = useState<any[]>([]);
  const [vets, setVets] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  
  // Estados para modales
  const [showCrearUsuario, setShowCrearUsuario] = useState(false);
  const [showCrearVet, setShowCrearVet] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [selectedVet, setSelectedVet] = useState<any>(null);
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  
  // Estado para mensajes
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [adminsData, vetsData, ownersData] = await Promise.all([
        adminService.obtenerAdministradores(),
        adminService.obtenerVeterinarios(),
        adminService.obtenerDueños(),
      ]);
      setAdmins(adminsData);
      setVets(vetsData);
      setOwners(ownersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Error al cargar los datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este administrador?')) {
      try {
        await adminService.eliminarAdministrador(id);
        await fetchData();
        showNotification('Administrador eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error al eliminar administrador:', error);
        showNotification('Error al eliminar administrador', 'error');
      }
    }
  };

  const handleDeleteVet = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este veterinario?')) {
      try {
        await adminService.eliminarVeterinario(id);
        await fetchData();
        showNotification('Veterinario eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error al eliminar veterinario:', error);
        showNotification('Error al eliminar veterinario', 'error');
      }
    }
  };

  const handleDeleteOwner = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este dueño? Se eliminarán también sus mascotas y citas.')) {
      try {
        await adminService.eliminarDueño(id);
        await fetchData();
        showNotification('Dueño eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error al eliminar dueño:', error);
        showNotification('Error al eliminar dueño', 'error');
      }
    }
  };

  const handleUsuarioCreado = async (usuarioId: string) => {
    try {
      await adminService.crearAdministrador({ usuario: usuarioId });
      await fetchData();
      setShowCrearUsuario(false);
      showNotification('Administrador creado exitosamente', 'success');
    } catch (error: any) {
      console.error('Error al crear administrador:', error);
      showNotification(error.response?.data?.message || 'Error al crear el administrador', 'error');
    }
  };

  const handleVeterinarioCreado = async () => {
    await fetchData();
    setShowCrearVet(false);
    showNotification('Veterinario creado exitosamente', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="relative text-center z-10">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-x-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Notificación Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <div className={`px-6 py-3 rounded-xl shadow-xl backdrop-blur-sm text-white font-medium flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
          }`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Panel de Administración
                </h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.nombre_completo}</p>
              </div>
            </div>
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
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8 animate-fade-in-up">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-2 px-3 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'admins'
                  ? 'border-primary text-primary bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">👑</span>
              <span>Administradores ({admins.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('vets')}
              className={`py-2 px-3 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'vets'
                  ? 'border-primary text-primary bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">👨‍⚕️</span>
              <span>Veterinarios ({vets.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('owners')}
              className={`py-2 px-3 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'owners'
                  ? 'border-primary text-primary bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">🐕</span>
              <span>Dueños ({owners.length})</span>
            </button>
          </nav>
        </div>

        {/* Panel de Administradores */}
        {activeTab === 'admins' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center">
                <span className="mr-2 text-3xl">👑</span>
                Administradores del Sistema
              </h2>
              <button
                onClick={() => setShowCrearUsuario(true)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Crear Administrador</span>
              </button>
            </div>
            <div className="glass rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/30">
                    {admins.map((admin, index) => (
                      <tr key={admin.id} className="hover:bg-white/30 transition-colors duration-200" style={{ animationDelay: `${index * 50}ms` }}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.usuario?.nombre_completo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {admin.usuario?.correo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                          <button
                            onClick={() => setSelectedAdmin(admin)}
                            className="text-yellow-600 hover:text-yellow-800 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="text-red-600 hover:text-red-800 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-1 ml-3"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Panel de Veterinarios */}
        {activeTab === 'vets' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center">
                <span className="mr-2 text-3xl">👨‍⚕️</span>
                Equipo Veterinario
              </h2>
              <button
                onClick={() => setShowCrearVet(true)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Crear Veterinario</span>
              </button>
            </div>
            <div className="glass rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-teal-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Especialidad</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/30">
                    {vets.map((vet, index) => (
                      <tr key={vet.id} className="hover:bg-white/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vet.usuario?.nombre_completo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {vet.usuario?.correo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 rounded-full text-xs font-medium">
                            {vet.especialidad_medica}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                          <button
                            onClick={() => setSelectedVet(vet)}
                            className="text-yellow-600 hover:text-yellow-800 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteVet(vet.id)}
                            className="text-red-600 hover:text-red-800 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-1 ml-3"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Panel de Dueños */}
        {activeTab === 'owners' && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6 flex items-center">
              <span className="mr-2 text-3xl">🐕</span>
              Dueños Registrados
            </h2>
            <div className="glass rounded-2xl shadow-xl border border-white/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-green-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dirección</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/30">
                    {owners.map((owner, index) => (
                      <tr key={owner.id} className="hover:bg-white/30 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {owner.usuario?.nombre_completo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {owner.usuario?.correo || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {owner.direccion_residencia || 'No registrada'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                          <button
                            onClick={() => setSelectedOwner(owner)}
                            className="text-yellow-600 hover:text-yellow-800 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteOwner(owner.id)}
                            className="text-red-600 hover:text-red-800 transition-all duration-300 hover:scale-110 inline-flex items-center space-x-1 ml-3"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      {showCrearUsuario && (
        <CrearUsuarioModal
          onClose={() => setShowCrearUsuario(false)}
          onUsuarioCreado={handleUsuarioCreado}
        />
      )}

      {showCrearVet && (
        <CrearVeterinarioModal
          onClose={() => setShowCrearVet(false)}
          onVeterinarioCreado={handleVeterinarioCreado}
        />
      )}

      {selectedAdmin && (
        <EditarAdminModal
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onAdminActualizado={fetchData}
        />
      )}

      {selectedVet && (
        <EditarVeterinarioModal
          vet={selectedVet}
          onClose={() => setSelectedVet(null)}
          onVeterinarioActualizado={fetchData}
        />
      )}

      {selectedOwner && (
        <EditarDueñoModal
          owner={selectedOwner}
          onClose={() => setSelectedOwner(null)}
          onDueñoActualizado={fetchData}
        />
      )}
    </div>
  );
};

export default AdminDashboard;