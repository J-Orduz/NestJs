import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  buttons?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, icon, gradientFrom, gradientTo, buttons }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center shadow-lg animate-float`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{title}</h1>
              <p className="text-sm text-gray-500">Bienvenido, {user?.nombre_completo}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {buttons}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;