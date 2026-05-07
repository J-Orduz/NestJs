export interface Usuario {
  id: string;
  nombre_completo: string;
  correo: string;
  rol: 'dueño' | 'veterinario' | 'administrador';
}

export interface LoginResponse {
  user: Usuario;
  token: string;
}

export interface Dueño {
  id: string;
  direccion_residencia: string;
  usuario: Usuario;
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  dueño: Dueño;
}

export interface Veterinario {
  id: string;
  especialidad_medica: string;
  usuario: Usuario;
}

export interface CitaMedica {
  id: string;
  fecha_cita: string;
  motivo_consulta: string;
  mascota: Mascota;
  veterinario: Veterinario;
}