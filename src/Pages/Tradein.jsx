import React, { useState, useEffect } from "react";
import TradeinTable from "../components/TradeinTable";
import TradeinModal from "../components/Modals/TradeinModal";
import Message from "../components/Alerts/Message";
import axios from "axios";

const Tradein = () => {
  const [tradeins, setTradeins] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTradein, setSelectedTradein] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [categorias, setCategorias] = useState([]);

  const fetchTradeins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/tradein/listarTradein`, options);
      setTradeins(Array.isArray(res.data.productos) ? res.data.productos : []);
    } catch (error) {
      setMensaje("Error al cargar los tradein");
    }
    setLoading(false);
  };

  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/listarCategorias`, options);
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      // No mostrar error aquí, solo dejar vacío
      setCategorias([]);
    }
  };
  useEffect(() => {
    fetchTradeins();
    fetchCategorias();
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    setSelectedTradein(null);
    setModalOpen(true);
  };

  const handleEdit = (tradein) => {
    setSelectedTradein(tradein);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este trade-in?")) return;
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/tradein/eliminarTradein/${id}`, options);
      setMensaje({respuesta:"Trade-in eliminado correctamente", tipo: true});
      fetchTradeins();
      setTimeout(() => {
        setMensaje("");
      }, 1500);
    } catch (error) {
      setMensaje({respuesta: error?.response?.data?.msg || "Error al eliminar el tradein", tipo: false});
    }
  };

  const handleModalSubmit = () => {
    fetchTradeins();
  };

  return (
    <div className="min-h-screen bg-[#EAEFEF] p-0 sm:p-2 md:p-4 flex flex-col h-full w-full min-w-0 min-h-0">
      <div className="flex flex-col flex-grow min-h-0 min-w-0 w-full h-full bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h1 className="text-2xl font-bold text-[#333446]">Gestión de Tradein</h1>
          <button onClick={handleAdd} className="bg-[#7F8CAA] hover:bg-[#333446] text-white px-4 py-2 rounded transition">Agregar Tradein</button>
        </div>
        {mensaje && (
        <Message tipo={mensaje.tipo}>{mensaje.respuesta || mensaje}</Message>
        )}
        {loading ? (
          <div className="text-center py-8 text-[#7F8CAA]">Cargando trade-in...</div>
        ) : (
          <TradeinTable tradeins={tradeins} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <TradeinModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={selectedTradein}
          categorias={categorias}
        />
      </div>
    </div>
  );
};

export default Tradein;
