
import React, { useEffect, useState } from "react";
import ProductTable from "../Components/ProductTable";
import ProductModal from "../components/Modals/ProductModal";
import Message from "../components/Alerts/Message";
import axios from "axios";

  // Manejar subida de archivo CSV
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'multipart/form-data'
        }
      };
      // Cambia la URL por la de tu endpoint para importar CSV
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products/importar-csv`, formData, options);
      setMensaje({ respuesta: 'Archivo CSV importado correctamente', tipo: true });
      fetchProducts();
    } catch (error) {
      setMensaje({ respuesta: error?.response?.data?.msg || 'Error al importar el archivo CSV', tipo: false });
    }
  };

const Products = () => {

  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/listarProductos`, options);
      // El backend retorna { productos: [...] }
      if (res.data && Array.isArray(res.data.productos)) {
        setProducts(res.data.productos);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setProducts([]);
      }
      console.log("Productos cargados:", res.data);
    } catch (error) {
      setMensaje("Error al cargar los productos");
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
    fetchProducts();
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
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditData(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      const token = localStorage.getItem('token');
      const options = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined
        }
      };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/products/eliminarProducto/${id}`, options);
      setMensaje({ respuesta: "Producto eliminado correctamente", tipo: true });
      fetchProducts();
      setTimeout(() => {
        setMensaje({});
      }, 3000);
    } catch (error) {
      setMensaje({ respuesta: "Error al eliminar el producto", tipo: false });
    }
  };

  const handleModalSubmit = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#EAEFEF] p-0 sm:p-2 md:p-4 flex flex-col h-full w-full min-w-0 min-h-0">
      <div className="flex flex-col flex-grow min-h-0 min-w-0 w-full h-full bg-white rounded-lg shadow-lg p-2 sm:p-4 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h1 className="text-2xl font-bold text-[#333446]">Gestión de Productos</h1>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <button onClick={handleAdd} className="bg-[#7F8CAA] hover:bg-[#333446] text-white px-4 py-2 rounded-lg font-semibold shadow">Agregar Producto</button>
            <label className="bg-[#B8CFCE] hover:bg-[#7F8CAA] text-[#333446] font-semibold px-4 py-2 rounded-lg cursor-pointer transition shadow text-sm">
              Subir CSV
              <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            </label>
          </div>
        </div>
        {Object.keys(mensaje).length > 0 && (
        <Message tipo={mensaje.tipo}>{mensaje.respuesta}</Message>
        )}
          {loading ? (
          <div className="text-center py-8 text-[#7F8CAA]">Cargando productos...</div>
        ) : (
          <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
        )}
          <ProductModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleModalSubmit}
            initialData={editData}
            categorias={categorias}
          />
      </div>
    </div>
  );
};

export default Products;
