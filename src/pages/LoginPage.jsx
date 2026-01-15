import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function LoginPage({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('¡Bienvenida!');
      navigate('/calendario');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error.code === 'auth/invalid-credential') {
        toast.error('Email o contraseña incorrectos');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Demasiados intentos. Intenta más tarde');
      } else {
        toast.error('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Sistema de Gestión
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ingresa tus credenciales
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={`mt-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/register" 
              className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;