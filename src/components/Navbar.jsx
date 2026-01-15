// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiCalendar, FiUsers, FiFileText, FiEdit, FiDollarSign, FiTool, FiBookOpen, FiCheckSquare, FiLogOut } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import toast from 'react-hot-toast';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const navItems = [
    { label: 'Calendario', path: '/calendario', icon: FiCalendar, color: 'text-blue-500', bgActive: 'bg-blue-500/10' },
    { label: 'Pacientes', path: '/pacientes', icon: FiUsers, color: 'text-green-500', bgActive: 'bg-green-500/10' },
    { label: 'Historias Clínicas', path: '/historias-clinicas', icon: FiFileText, color: 'text-purple-500', bgActive: 'bg-purple-500/10' },
    { label: 'Notas de Terapia', path: '/notas-terapia', icon: FiEdit, color: 'text-indigo-500', bgActive: 'bg-indigo-500/10' },
    { label: 'Herramientas', path: '/herramientas', icon: FiTool, color: 'text-orange-500', bgActive: 'bg-orange-500/10' },
    { label: 'Pendientes', path: '/pendientes', icon: FiCheckSquare, color: 'text-teal-500', bgActive: 'bg-teal-500/10' },
    { label: 'Recursos', path: '/recursos', icon: FiBookOpen, color: 'text-pink-500', bgActive: 'bg-pink-500/10' },
    { label: 'Pagos', path: '/pagos', icon: FiDollarSign, color: 'text-emerald-500', bgActive: 'bg-emerald-500/10' },
  ];

  const isActive = (path) => location.pathname === path;

  // No mostrar navbar en la página de login
  if (!user) return null;

  return (
    <nav className={`${darkMode ? 'bg-slate-900 border-b border-slate-800' : 'bg-white border-b border-gray-200'} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
            <span className="text-3xl">🏥</span>
            PsicoGest
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    active
                      ? `${item.bgActive} ${item.color}`
                      : darkMode
                        ? 'text-gray-300 hover:bg-slate-800'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} className={active ? item.color : ''} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle, Logout & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition ${
                darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <button
              onClick={handleLogout}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                darkMode 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
              title="Cerrar Sesión"
            >
              <FiLogOut size={16} />
              Salir
            </button>

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden pb-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    active
                      ? `${item.bgActive} ${item.color}`
                      : darkMode
                        ? 'text-gray-300 hover:bg-slate-800'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={18} className={active ? item.color : ''} />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Logout button in mobile menu */}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition mt-2 ${
                darkMode 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              <FiLogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}