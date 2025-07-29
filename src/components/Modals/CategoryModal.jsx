import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from '../Alerts/Message';

const initialForm = {
  nombreCategoria: "",
  descripcionCategoria: ""
};

const CategoryModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialForm, ...initialData });
    } else {
      setForm(initialForm);
    }
    setMensaje({});
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones UX
    if (!form.nombreCategoria || !form.descripcionCategoria) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return;
    }
    if (form.nombreCategoria.trim().length < 3) {
      setMensaje({ respuesta: "El nombre debe tener al menos 3 caracteres", tipo: false });
      return;
    }
    if (form.descripcionCategoria.trim().length < 5) {
      setMensaje({ respuesta: "La descripción debe tener al menos 5 caracteres", tipo: false });
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
        // Actualizar categoría
        const url = `${import.meta.env.VITE_BACKEND_URL}/categories/actualizarCategoria/${initialData._id}`;
        await axios.put(url, form, options);
        setMensaje({ respuesta: "Categoría actualizada correctamente", tipo: true });
      } else {
        // Agregar categoría
        const url = `${import.meta.env.VITE_BACKEND_URL}/categories/crearCategoria`;
        await axios.post(url, form, options);
        setMensaje({ respuesta: "Categoría agregada correctamente", tipo: true });
      }
      setTimeout(() => {
        setForm(initialForm);
        setMensaje({});
        onSubmit(form);
        onClose();
      }, 1500);
    } catch (error) {
      setMensaje({ respuesta: error?.response?.data?.msg || "Ocurrió un error al guardar la categoría.", tipo: false });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#102E50]">{initialData ? "Editar" : "Agregar"} Categoría</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input name="nombreCategoria" value={form.nombreCategoria} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea name="descripcionCategoria" value={form.descripcionCategoria} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA] resize-none" rows={3} required />
          </div>
          {mensaje.respuesta && (
            <div className={`text-center text-sm ${mensaje.tipo ? "text-green-600" : "text-red-500"}`}>{mensaje.respuesta}</div>
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

export default CategoryModal;
