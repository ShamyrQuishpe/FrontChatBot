
import React, { useContext , useState  } from "react";
import { Link, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';


const user = {
  name: "Juan Pérez",
  role: "Administrador", // Puedes cambiar el rol según el usuario autenticado
};


const Dashboard = () => {
  const {auth} = useContext(AuthContext);
  const [activeMenu, setActiveMenu] = useState("productos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between px-2 sm:px-4 py-3 bg-[#333446] text-white shadow-md relative gap-2 w-full">
        <div className="flex items-center justify-between w-full md:w-auto gap-2">
          {/* Botón hamburguesa solo en móvil */}
          <button
            className="md:hidden mr-2 focus:outline-none p-2 rounded hover:bg-[#7F8CAA] transition"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg sm:text-xl tracking-wide whitespace-nowrap">Chatbot</span>
          {/* Avatar y nombre en móvil */}
          <span className="md:hidden flex items-center gap-2 text-xs font-semibold bg-[#7F8CAA] text-[#333446] px-2 py-1 rounded">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4"/></svg>
            {auth?.nombre || 'Usuario'}
          </span>
          {/* Botón cerrar sesión en móvil */}
          <Link
            to="/"
            className="md:hidden bg-[#7F8CAA] hover:bg-[#EAEFEF] text-[#333446] font-bold px-3 py-1 rounded transition focus:outline-none"
            aria-label="Cerrar sesión"
            onClick={() => {
              localStorage.removeItem('token');
            }}
          >
            <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            <span className="hidden xs:inline">Cerrar Sesión</span>
          </Link>
        </div>
        {/* Info usuario y cerrar sesión en desktop */}
        <div className="hidden md:flex items-center gap-4 w-full md:w-auto justify-end">
          <span className="flex items-center gap-2 text-sm whitespace-nowrap">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#7F8CAA] text-[#333446] font-bold">
              {auth?.nombre?.[0]?.toUpperCase() || 'U'}
            </span>
            <span className="font-semibold">{auth?.nombre || 'Usuario'}</span>
            <span className="text-xs font-normal">({auth.rol})</span>
          </span>
          <Link
            to="/"
            className="bg-[#7F8CAA] hover:bg-[#EAEFEF] text-[#333446] font-bold px-3 py-1 rounded transition focus:outline-none"
            aria-label="Cerrar sesión"
            onClick={() => {
              localStorage.removeItem('token');
            }}
          >
            <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            <span className="hidden xs:inline">Cerrar Sesión</span>
          </Link>
        </div>
      </header>
      <div className="flex flex-1 relative">
        {/* Sidebar escritorio */}
        <aside className="hidden md:flex flex-col w-64 bg-[#333446] text-white py-6 px-4 space-y-2">
          <MenuButton
            label="Gestión Productos"
            icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" /></svg>}
            active={activeMenu === "productos"}
            onClick={() => setActiveMenu("productos")}
            to="/dashboard/products"
          />
          <MenuButton
            label="Gestión Categorías"
            icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
            active={activeMenu === "categorias"}
            onClick={() => setActiveMenu("categorias")}
            to="/dashboard/categories"
          />
          <MenuButton
            label="Tradein"
            icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m-2 8a9 9 0 100-18 9 9 0 000 18z" /></svg>}
            active={activeMenu === "tradein"}
            onClick={() => setActiveMenu("tradein")}
            to="/dashboard/tradein"
          />
          {auth.rol === "Administrador" && (
            <MenuButton
              label="Gestión Clientes"
              icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
              active={activeMenu === "usuarios"}
              onClick={() => setActiveMenu("usuarios")}
              to="/dashboard/clients"
            />
          )}
        </aside>
        {/* Sidebar móvil (desplegable) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden transition-opacity duration-200" onClick={() => setMobileMenuOpen(false)}>
            <nav
              tabIndex={-1}
              className="absolute left-0 top-0 h-full w-64 bg-[#333446] text-white flex flex-col py-6 px-4 space-y-2 shadow-lg animate-slideIn"
              onClick={e => e.stopPropagation()}
              aria-label="Menú principal"
            >
              <button
                className="self-end mb-6 text-white focus:outline-none p-2 rounded hover:bg-[#7F8CAA] transition"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <MenuButton
                label="Gestión de Productos"
                icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" /></svg>}
                active={activeMenu === "productos"}
                onClick={() => { setActiveMenu("productos"); setMobileMenuOpen(false); }}
                to="/dashboard/products"
              />
              <MenuButton
                label="Gestión de Categorías"
                icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>}
                active={activeMenu === "categorias"}
                onClick={() => { setActiveMenu("categorias"); setMobileMenuOpen(false); }}
                to="/dashboard/categories"
              />
              <MenuButton
                label="Tradein"
                icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m-2 8a9 9 0 100-18 9 9 0 000 18z" /></svg>}
                active={activeMenu === "tradein"}
                onClick={() => { setActiveMenu("tradein"); setMobileMenuOpen(false); }}
                to="/dashboard/tradein"
              />
              {auth.rol === "Administrador" && (
                <MenuButton
                  label="Gestión de Clientes"
                  icon={<svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                  active={activeMenu === "usuarios"}
                  onClick={() => { setActiveMenu("usuarios"); setMobileMenuOpen(false); }}
                  to="/dashboard/clients"
                />
              )}
            </nav>
          </div>
        )}
        {/* Contenido principal */}
        <main className="flex-1 bg-gray-100 shadow-lg mt-2 md:mt-0 mx-0 md:mx-4 mb-20 md:mb-0 p-1 sm:p-2 md:rounded-tl-2xl md:rounded-bl-2xl overflow-x-auto">
          <Outlet />
        </main>
      </div>
      {/* Footer */}
      <footer className="w-full bg-[#333446] text-white text-center py-3 mt-auto fixed bottom-0 left-0 z-40">
        <span className="text-sm">&copy; {new Date().getFullYear()} ChatBot - Todos los derechos reservadoss</span>
      </footer>
    </div>
  );

// Botón de menú reutilizable con icono y feedback visual
function MenuButton({ label, icon, active, onClick, to }) {
  const className = `flex items-center w-full text-left px-4 py-2 rounded transition font-semibold focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] ${active ? "bg-[#7F8CAA] text-[#333446]" : "hover:bg-[#B8CFCE]"}`;
  if (to) {
    return (
      <Link
        to={to}
        className={className}
        tabIndex={0}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
      >
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button
      className={className}
      onClick={onClick}
      tabIndex={0}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      {label}
    </button>
  );
}
};

export default Dashboard;
