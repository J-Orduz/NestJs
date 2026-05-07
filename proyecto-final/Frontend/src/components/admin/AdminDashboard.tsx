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
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in-up">
          <div className={`px-6 py-3 rounded-lg shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {notification.message}
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">👑</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.nombre_completo}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition"
            >
              <span>🚪</span>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('admins')}
              className={`py-2 px-3 border-b-2 font-medium text-sm transition ${
                activeTab === 'admins'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👑 Administradores ({admins.length})
            </button>
            <button
              onClick={() => setActiveTab('vets')}
              className={`py-2 px-3 border-b-2 font-medium text-sm transition ${
                activeTab === 'vets'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👨‍⚕️ Veterinarios ({vets.length})
            </button>
            <button
              onClick={() => setActiveTab('owners')}
              className={`py-2 px-3 border-b-2 font-medium text-sm transition ${
                activeTab === 'owners'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🐕 Dueños ({owners.length})
            </button>
          </nav>
        </div>

        {activeTab === 'admins' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Administradores</h2>
              <button
                onClick={() => setShowCrearUsuario(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Crear Administrador</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {admin.usuario?.nombre_completo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.usuario?.correo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => setSelectedAdmin(admin)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'vets' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Veterinarios</h2>
              <button
                onClick={() => setShowCrearVet(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Crear Veterinario</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vets.map((vet) => (
                    <tr key={vet.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vet.usuario?.nombre_completo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vet.usuario?.correo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vet.especialidad_medica}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => setSelectedVet(vet)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteVet(vet.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'owners' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dueños</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {owners.map((owner) => (
                    <tr key={owner.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {owner.usuario?.nombre_completo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {owner.usuario?.correo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {owner.direccion_residencia || 'No registrada'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                        <button
                          onClick={() => setSelectedOwner(owner)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteOwner(owner.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

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