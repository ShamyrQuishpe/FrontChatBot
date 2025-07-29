import React, { useState, useEffect } from "react";
import CategoryTable from "../components/CategoryTable";
import CategoryModal from "../components/Modals/CategoryModal";
import Message from "../components/Alerts/Message";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/listarCategorias`, options);
      setCategories(res.data);
    } catch (error) {
      setFeedback("Error al cargar las categorías");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategorias();
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    setSelectedCategoria(null);
    setModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/categories/eliminarCategoria/${id}`, options);
      setMensaje({respuesta:"Categoría eliminada correctamente", tipo: true});
      fetchCategorias();
      setTimeout(() => {
        setMensaje({});
      }, 1500);
    } catch (error) {
      setMensaje({respuesta: error?.response?.data?.msg || "Error al eliminar la categoría", tipo: false});
    }
  };

  const handleModalSubmit = () => {
    fetchCategorias();
  };

  return (
    <div className="min-h-screen bg-[#EAEFEF] p-0 sm:p-2 md:p-4 flex flex-col h-full w-full min-w-0 min-h-0">
      <div className="flex flex-col flex-grow min-h-0 min-w-0 w-full h-full bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h1 className="text-2xl font-bold text-[#333446]">Gestión de Categorías</h1>
          <button onClick={handleAdd} className="bg-[#7F8CAA] hover:bg-[#333446] text-white px-4 py-2 rounded transition">Agregar Categoría</button>
        </div>
        {Object.keys(mensaje).length > 0 && (
        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
        )}
        {loading ? (
          <div className="text-center py-8 text-[#7F8CAA]">Cargando categorías...</div>
        ) : (
          <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <CategoryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={selectedCategoria}
        />
      </div>
    </div>
  );
};

export default Categories;
