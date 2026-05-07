import axios from 'axios';
import type { LoginResponse, CitaMedica, Mascota, Veterinario } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/vet';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (correo: string, contrasenia: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { correo, contrasenia });
    return response.data;
  },
};

export const citaService = {
  obtenerCitas: async (): Promise<CitaMedica[]> => {
    const response = await api.get('/cita-medica');
    return response.data;
  },
  crearCita: async (data: {
    fecha_cita: string;
    motivo_consulta: string;
    mascota: string;
    veterinario: string;
  }): Promise<CitaMedica> => {
    const response = await api.post('/cita-medica', data);
    return response.data;
  },
  actualizarCita: async (id: string, data: Partial<{
    fecha_cita: string;
    motivo_consulta: string;
    mascota: string;
    veterinario: string;
  }>): Promise<CitaMedica> => {
    const response = await api.patch(`/cita-medica/${id}`, data);
    return response.data;
  },
  eliminarCita: async (id: string): Promise<void> => {
    await api.delete(`/cita-medica/${id}`);
  },
};

export const mascotaService = {
  obtenerMascotas: async (): Promise<Mascota[]> => {
    const response = await api.get('/mascota');
    return response.data;
  },
  crearMascota: async (data: {
    nombre: string;
    especie: string;
    raza: string;
    dueño: string;
  }): Promise<Mascota> => {
    const response = await api.post('/mascota', data);
    return response.data;
  },
  actualizarMascota: async (id: string, data: Partial<{
    nombre: string;
    especie: string;
    raza: string;
  }>): Promise<Mascota> => {
    const response = await api.patch(`/mascota/${id}`, data);
    return response.data;
  },
  eliminarMascota: async (id: string): Promise<void> => {
    await api.delete(`/mascota/${id}`);
  },
};

export const veterinarioService = {
  obtenerVeterinarios: async (): Promise<Veterinario[]> => {
    const response = await api.get('/veterinario');
    return response.data;
  },
};

export const duenioService = {
  obtenerDueñoPorUsuario: async (usuarioId: string): Promise<any> => {
    const response = await api.get(`/duenio/usuario/${usuarioId}`);
    return response.data;
  },
  obtenerDueñoActual: async (dueñoId: string): Promise<any> => {
    const response = await api.get(`/duenio/${dueñoId}`);
    return response.data;
  },
  actualizarDueño: async (dueñoId: string, data: {
    nombre_completo?: string;
    correo?: string;
    contrasenia?: string;
    direccion_residencia?: string;
  }): Promise<any> => {
    const response = await api.patch(`/duenio/${dueñoId}`, data);
    return response.data;
  },
};

export const adminService = {
  // Usuarios 
  crearUsuario: async (data: {
    nombre_completo: string;
    correo: string;
    contrasenia: string;
  }): Promise<{ id: string; message: string }> => {
    const response = await api.post('/usuario/registrar', data);
    return response.data; 
  },

  // Administradores
  crearAdministrador: async (data: { usuario: string }): Promise<any> => {
    const response = await api.post('/administrador', data);
    return response.data;
  },
  obtenerAdministradores: async (): Promise<any[]> => {
    const response = await api.get('/administrador');
    return response.data;
  },
  actualizarAdministrador: async (id: string, data: Partial<{
    nombre_completo: string;
    correo: string;
    contrasenia: string;
  }>): Promise<any> => {
    const response = await api.patch(`/administrador/${id}`, data);
    return response.data;
  },
  eliminarAdministrador: async (id: string): Promise<void> => {
    await api.delete(`/administrador/${id}`);
  },

  // Veterinarios
  crearVeterinario: async (data: {
    especialidad_medica: string;
    usuario: string;
  }): Promise<any> => {
    const response = await api.post('/veterinario', data);
    return response.data;
  },
  obtenerVeterinarios: async (): Promise<any[]> => {
    const response = await api.get('/veterinario');
    return response.data;
  },
  actualizarVeterinario: async (id: string, data: Partial<{
    nombre_completo: string;
    correo: string;
    contrasenia: string;
    especialidad_medica: string;
  }>): Promise<any> => {
    const response = await api.patch(`/veterinario/${id}`, data);
    return response.data;
  },
  eliminarVeterinario: async (id: string): Promise<void> => {
    await api.delete(`/veterinario/${id}`);
  },

  // Dueños
  obtenerDueños: async (): Promise<any[]> => {
    const response = await api.get('/duenio');
    return response.data;
  },
  actualizarDueño: async (id: string, data: Partial<{
    nombre_completo: string;
    correo: string;
    contrasenia: string;
    direccion_residencia: string;
  }>): Promise<any> => {
    const response = await api.patch(`/duenio/${id}`, data);
    return response.data;
  },
  eliminarDueño: async (id: string): Promise<void> => {
    await api.delete(`/duenio/${id}`);
  },
};

export const vetService = {
  // Obtener citas del veterinario autenticado
  obtenerMisCitas: async (): Promise<CitaMedica[]> => {
    const response = await api.get('/cita-medica');
    return response.data;
  },
  
  // Obtener todos los dueños (para asignar mascotas)
  obtenerDueños: async (): Promise<any[]> => {
    const response = await api.get('/duenio');
    return response.data;
  },
  
  // Actualizar perfil del veterinario
  actualizarPerfil: async (veterinarioId: string, data: {
    nombre_completo?: string;
    correo?: string;
    contrasenia?: string;
    especialidad_medica?: string;
  }): Promise<any> => {
    const response = await api.patch(`/veterinario/${veterinarioId}`, data);
    return response.data;
  },
  
  // Obtener veterinario actual
  obtenerVeterinarioActual: async (): Promise<any> => {
    const response = await api.get('/veterinario/actual');
    return response.data;
  },
};

export default api;