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

export const dueñoService = {
  obtenerDueñoPorUsuario: async (usuarioId: string): Promise<any> => {
    const response = await api.get(`/usuarios/${usuarioId}/dueno`);
    return response.data;
  },
};

export const veterinarioService = {
  obtenerVeterinarios: async (): Promise<Veterinario[]> => {
    const response = await api.get('/veterinario');
    return response.data;
  },
};

export default api;