import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from '../Alerts/Message';

const initialForm = {
  nombre: "",
  apellido: "",
  cedula: "",
  telefono: "",
  email: "",
  area: "",
  rol: "Cliente",
  status: "Activo",
  password: ""
};

const ClientModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState({});
  
  useEffect(() => {
    // Rellenar el formulario con initialData o valores por defecto
    if (open) {
      if (initialData) {
        setForm({
          nombre: initialData.nombre || "",
          apellido: initialData.apellido || "",
          cedula: initialData.cedula || "",
          telefono: initialData.telefono || "",
          email: initialData.email || "",
          area: initialData.area || "",
          rol: initialData.rol || "Cliente",
          status: initialData.status || "Activo",
          password: "" // Nunca mostrar password al editar
        });
      } else {
        setForm(initialForm);
      }
      setMensaje({});
    }
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones UX
    if (!form.nombre || !form.apellido || !form.cedula || !form.telefono || !form.email || !form.area || !form.rol) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return;
    }
    if (!initialData && !form.password) {
      setMensaje({ respuesta: "La contraseña es obligatoria para nuevos clientes", tipo: false });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      if (initialData && initialData._id) {
        // Actualizar cliente: solo enviar los campos permitidos
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/users/${initialData._id}`;
        const updateData = {
          telefono: form.telefono,
          area: form.area,
          rol: form.rol,
          status: form.status
        };
        await axios.put(url, updateData, options);
        setMensaje({ respuesta: "Cliente actualizado correctamente", tipo: true });
      } else {
        // Agregar cliente
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/registro`;
        await axios.post(url, form, options);
        setMensaje({ respuesta: "Cliente agregado correctamente", tipo: true });
      }
      setTimeout(() => {
        setForm(initialForm);
        setMensaje({});
        onSubmit(form);
        onClose();
      }, 1500);
    } catch (error) {
      setMensaje({ respuesta: error?.response?.data?.msg || "Ocurrió un error al guardar el cliente.", tipo: false });
    }
  };

  // Función para actualizar la contraseña del cliente
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordNuevo || !repetirPassword) {
      setMensaje({ respuesta: "Debes ingresar y repetir la nueva contraseña", tipo: false });
      return;
    }
    if (passwordNuevo !== repetirPassword) {
      setMensaje({ respuesta: "Las contraseñas no coinciden", tipo: false });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      const url = `${import.meta.env.VITE_BACKEND_URL}/users/nuevapassword/${initialData._id}`;
      await axios.put(url, { passwordnuevo: passwordNuevo, repetirpassword: repetirPassword }, options);
      setMensaje({ respuesta: "Contraseña actualizada correctamente", tipo: true });
      setPasswordNuevo("");
      setRepetirPassword("");
    } catch (error) {
      setMensaje({ respuesta: error?.response?.data?.msg || "Error al actualizar la contraseña.", tipo: false });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#102E50]">{initialData ? "Editar" : "Agregar"} Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {initialData ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Área</label>
                  <input name="area" value={form.area} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select name="rol" value={form.rol} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]">
                    <option value="Cliente">Cliente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="showPasswordFields"
                  checked={showPasswordFields}
                  onChange={e => setShowPasswordFields(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-[#7F8CAA]"
                />
                <label htmlFor="showPasswordFields" className="text-sm">¿Desea actualizar la contraseña?</label>
              </div>
              {showPasswordFields && (
                <form onSubmit={handlePasswordUpdate} className="space-y-2 mt-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
                    <input type="password" value={passwordNuevo} onChange={e => setPasswordNuevo(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Repetir contraseña</label>
                    <input type="password" value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                  </div>
                  <button type="submit" className="bg-[#7F8CAA] hover:bg-[#333446] text-white px-4 py-2 rounded">Actualizar contraseña</button>
                </form>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Apellido</label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Cédula</label>
                  <input name="cedula" value={form.cedula} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Área</label>
                  <input name="area" value={form.area} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select name="rol" value={form.rol} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]">
                    <option value="Cliente">Cliente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
              </div>
            </>
          )}
          {Object.keys(mensaje).length > 0 && (
            <Message tipo={mensaje.tipo}>
              {mensaje.respuesta}
            </Message>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-[#7F8CAA] hover:bg-[#333446] text-white px-4 py-2 rounded">{initialData ? "Actualizar" : "Agregar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
