import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function RegisterPage({ darkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name
      });

      toast.success('¡Cuenta creada exitosamente!');
      navigate('/calendario');
    } catch (error) {
      console.error('Error al registrarse:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Email inválido');
      } else if (error.code === 'auth/weak-password') {
        toast.error('La contraseña es muy débil');
      } else {
        toast.error('Error al crear la cuenta');
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
            Crear Cuenta
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Completa el formulario para registrarte
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Tu nombre"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Repite tu contraseña"
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
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className={`mt-6 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link 
              to="/login" 
              className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;