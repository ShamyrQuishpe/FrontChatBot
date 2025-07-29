import React, { useState, useEffect } from "react";
import ClientTable from "../components/ClientTable";
import ClientModal from "../components/Modals/ClientModal";
import Message from "../components/Alerts/Message";
import axios from "axios";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/users`, options);
      setClients(Array.isArray(res.data) ? res.data : []);  //res.data
    } catch (error) {
      setMensaje("Error al cargar los clientes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/users/${id}`, options);
      setMensaje({respuesta:"Cliente eliminado correctamente", tipo: true});
      fetchClients();
      setTimeout(() => {
        setMensaje({});
      }, 1500);
    } catch (error) {
      setMensaje({respuesta: error?.response?.data?.msg || "Error al eliminar el cliente", tipo: false});
    }
  };

  const handleModalSubmit = () => {
    fetchClients();
  };

  return (
    <div className="min-h-screen bg-[#EAEFEF] p-0 sm:p-2 md:p-4 flex flex-col h-full w-full min-w-0 min-h-0">
      <div className="flex flex-col flex-grow min-h-0 min-w-0 w-full h-full bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h1 className="text-2xl font-bold text-[#333446]">Gestión de Clientes</h1>
          <button onClick={handleAdd} className="bg-[#7F8CAA] hover:bg-[#333446] text-white px-4 py-2 rounded transition">Agregar Cliente</button>
        </div>
        {Object.keys(mensaje).length > 0 && (
        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
        )}
        {loading ? (
          <div className="text-center py-8 text-[#7F8CAA]">Cargando clientes...</div>
        ) : (
          <ClientTable clients={clients} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        <ClientModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          initialData={selectedClient}
        />
      </div>
    </div>
  );
};

export default Clients;
