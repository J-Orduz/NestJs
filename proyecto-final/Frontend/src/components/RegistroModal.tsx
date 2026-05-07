import React, { useState } from 'react';
import { usuarioService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegistroModalProps {
  onClose: () => void;
}

const RegistroModal: React.FC<RegistroModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    contrasenia: '',
    confirmar_contrasenia: '',
    direccion_residencia: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (formData.contrasenia !== formData.confirmar_contrasenia) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.contrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setStep('loading');

    try {
      // Paso 1: Crear el usuario
      const usuarioResponse = await usuarioService.registrar({
        nombre_completo: formData.nombre_completo,
        correo: formData.correo,
        contrasenia: formData.contrasenia,
      });
      
      const usuarioId = usuarioResponse.id;
      
      // Paso 2: Hacer login para obtener el token
      const loginResponse = await authService.login(formData.correo, formData.contrasenia);
      const token = loginResponse.token;
      
      // Paso 3: Crear el dueño
      const createDueñoResponse = await fetch('http://localhost:3000/api/vet/duenio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          direccion_residencia: formData.direccion_residencia,
          usuario: usuarioId,
        }),
      });
      
      if (!createDueñoResponse.ok) {
        const errorData = await createDueñoResponse.json();
        throw new Error(errorData.message || 'Error al crear el perfil de dueño');
      }
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`¡Bienvenido ${formData.nombre_completo}! Tu cuenta ha sido creada exitosamente.`);
      setStep('success');
      
      // Esperar 2 segundos para mostrar el mensaje de éxito
      setTimeout(() => {
        // Iniciar sesión automáticamente
        login(loginResponse.user, loginResponse.token);
        // Redirigir al dashboard del dueño
        navigate('/owner/dashboard');
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.');
      setStep('form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/30 animate-fade-in-up">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-t-2xl p-6 text-white relative">
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {step === 'success' ? '¡Registro Exitoso!' : 'Crear Cuenta'}
              </h2>
              <p className="text-sm opacity-90">
                {step === 'success' 
                  ? 'Serás redirigido automáticamente' 
                  : 'Regístrate como dueño de mascota'}
              </p>
            </div>
          </div>
        </div>

        {step === 'loading' && (
          <div className="p-12 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Creando tu cuenta...</p>
            <p className="text-sm text-gray-400 mt-2">Por favor espera</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">¡Cuenta Creada!</h3>
            <p className="text-gray-600 mb-2">{successMessage}</p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Redirigiendo al panel principal...</span>
            </div>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Residencia *
              </label>
              <input
                type="text"
                name="direccion_residencia"
                value={formData.direccion_residencia}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Calle 123, Ciudad"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                name="contrasenia"
                value={formData.contrasenia}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                name="confirmar_contrasenia"
                value={formData.confirmar_contrasenia}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Repite tu contraseña"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm animate-fade-in flex items-start space-x-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 font-medium"
            >
              {submitting ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistroModal;