import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Alerts/Message';
import AuthContext from '../context/AuthProvider';

export const Login = () => {
  const navigate = useNavigate();
  const {setAuth, perfil} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [mensaje]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const validarForm = () => {
    if (!form.email || !form.password) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setMensaje({ respuesta: "Ingrese un correo electrónico válido", tipo: false });
      return false;
    }

    if (form.password.length < 6) {
      setMensaje({ respuesta: "La contraseña debe tener al menos 6 caracteres", tipo: false });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarForm()) return;

    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/users/login`;
      const respuesta = await axios.post(url, form);
      
      localStorage.setItem('token', respuesta.data.token);
      setAuth(respuesta.data);
      await perfil(respuesta.data.token);
      
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Error de login:', error);
      setMensaje({ 
        respuesta: error.response?.data?.msg || "Error al iniciar sesión", 
        tipo: false 
      });
      setForm({ email: form.email, password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAEFEF] px-2">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md border border-[#B8CFCE] flex flex-col items-center">
        <span className="font-bold text-2xl sm:text-3xl text-[#333446] tracking-wide mb-2 mt-2 sm:mt-4">ChatBot</span>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#333446] tracking-wide">Iniciar Sesión</h2>
        {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>
              {mensaje.respuesta}
            </Message>
          )}
        <form onSubmit={handleSubmit}  className="space-y-5 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#333446] mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 border border-[#B8CFCE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] bg-[#EAEFEF] text-[#333446] placeholder-[#7F8CAA]"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              required
              aria-label="Correo electrónico"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#333446] mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border border-[#B8CFCE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] bg-[#EAEFEF] text-[#333446] placeholder-[#7F8CAA]"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                aria-label="Contraseña"
                disabled={isLoading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7F8CAA] focus:outline-none"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  // Ojito cerrado (eye-off)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.94 17.94A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13m1.664-1.664A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.664 5.13m-1.664 1.664L4.222 4.222" />
                    <line x1="3" y1="3" x2="21" y2="21" stroke="#7F8CAA" strokeWidth="2" />
                  </svg>
                ) : (
                  // Ojito abierto (eye)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" stroke="#7F8CAA" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-black text-white p-2 md:p-3 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm md:text-base font-medium flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            aria-label="Ingresar"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
