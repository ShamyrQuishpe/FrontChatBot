import React, { useState, useEffect } from "react";
import Message from '../Alerts/Message';
import axios from "axios";

const initialForm = {
  nombreEquipo: "",
  valorMaximo: "",
  valorMinimo: "",
  categoriaNombre: "",
};

const TradeinModal = ({ open, onClose, onSubmit, initialData, categorias }) => {
  const [form, setForm] = useState(initialForm);
  const [mensaje, setMensaje] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          nombreEquipo: initialData.nombreEquipo || "",
          valorMaximo: initialData.valorMaximo || "",
          valorMinimo: initialData.valorMinimo || "",
          categoriaNombre: Array.isArray(initialData.categoriaNombre) ? initialData.categoriaNombre[0]?.nombreCategoria : initialData.categoriaNombre?.nombreCategoria || "",
        });
      } else {
        setForm(initialForm);
      }
      setMensaje({});
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombreEquipo || !form.valorMaximo || !form.valorMinimo || !form.categoriaNombre) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
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
        // Actualizar tradein
        const url = `${import.meta.env.VITE_BACKEND_URL}/tradein/actualizarTradein/${initialData._id}`;
        await axios.put(url, form, options);
        setMensaje({ respuesta: "Trade-in actualizado correctamente", tipo: true });
      } else {
        // Agregar tradein
        const url = `${import.meta.env.VITE_BACKEND_URL}/tradein/agregarTradein`;
        await axios.post(url, form, options);
        setMensaje({ respuesta: "Trade-in agregado correctamente", tipo: true });
      }
      setTimeout(() => {
        setForm(initialForm);
        setMensaje({});
        onSubmit(form);
        onClose();
      }, 1500);
    } catch (error) {
      setMensaje({ respuesta: error?.response?.data?.msg || "Ocurrió un error al guardar el trade-in.", tipo: false });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#102E50]">{initialData ? "Editar" : "Agregar"} Trade-in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre Equipo</label>
            <input name="nombreEquipo" value={form.nombreEquipo} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Valor Máximo</label>
              <input name="valorMaximo" type="number" value={form.valorMaximo} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor Mínimo</label>
              <input name="valorMinimo" type="number" value={form.valorMinimo} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select name="categoriaNombre" value={form.categoriaNombre} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required>
              <option value="">Selecciona una categoría</option>
              {categorias && categorias.map(cat => (
                <option key={cat._id} value={cat.nombreCategoria}>{cat.nombreCategoria}</option>
              ))}
            </select>
          </div>
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

export default TradeinModal;
