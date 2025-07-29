import React, { useState, useEffect } from "react";
import axios from "axios";
import Message from '../Alerts/Message';

const initialForm = {
  codigoModelo: "",
  nombreEquipo: "",
  color: "",
  capacidad: "",
  precio: "",
  tipo: "",
  estado: "Disponible",
  categoriaNombre: "",
};



const ProductModal = ({ open, onClose, onSubmit, initialData, categorias: categoriasProp }) => {
  const [form, setForm] = useState({ ...initialForm, ...initialData });
  const [mensaje, setMensaje] = useState({});
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categorias, setCategorias] = useState(categoriasProp || []);

  // Obtener categorías si no vienen como prop
  useEffect(() => {
    if ((!categoriasProp || categoriasProp.length === 0) && open) {
      const fetchCategorias = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories/listarCategorias`, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined }
          });
          setCategorias(res.data);
        } catch (err) {
          setCategorias([]);
        }
      };
      fetchCategorias();
    } else if (categoriasProp && categoriasProp.length > 0) {
      setCategorias(categoriasProp);
    }
  }, [categoriasProp, open]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        console.log("Inicializando datos del producto", initialData);
        // Buscar el nombre de la categoría si initialData trae un id o valor diferente
        let categoriaNombre = "";
        if (initialData.categoriaNombre) {
          // Si ya viene el nombre, usarlo
          categoriaNombre = initialData.categoriaNombre;
        } else if (initialData.categoriaId && categorias && categorias.length > 0) {
          // Si viene el id, buscar el nombre
          const cat = categorias.find(c => c._id === initialData.categoriaId);
          categoriaNombre = cat ? cat.nombreCategoria : "";
        }
        setForm({
          codigoModelo: initialData?.codigoModelo ?? "",
          nombreEquipo: initialData?.nombreEquipo ?? "",
          color: initialData?.color ?? "",
          capacidad: initialData?.capacidad ?? "",
          precio: initialData?.precio ?? "",
          tipo: initialData?.tipo ?? "",
          estado: initialData.estado || "Disponible",
          categoriaNombre: initialData?.categoriaNombre ?? "",
        });
        setPreview(initialData.imagen?.url || null);
      } else {
        setForm(initialForm);
        setPreview(null);
      }
      setImagen(null);
      setMensaje({});
    }
    let timer;
    if (Object.keys(mensaje).length > 0) {
      timer = setTimeout(() => {
        setMensaje({});
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [initialData, open, categorias]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones UX
    if (!form.codigoModelo || !form.nombreEquipo || !form.color || !form.capacidad || !form.precio || !form.tipo || !form.categoriaNombre) {
      setMensaje({ respuesta: "Todos los campos son obligatorios", tipo: false });
      return;
    }
    // Validar imagen obligatoria al agregar
    if (!initialData && !imagen) {
      setMensaje({ respuesta: "La imagen es obligatoria", tipo: false });
      return;
    }
    if (form.nombreEquipo.trim().length < 3) {
      setMensaje({ respuesta: "El nombre debe tener al menos 3 caracteres", tipo: false });
      return;
    }
    if (form.codigoModelo.trim().length < 2) {
      setMensaje({ respuesta: "El código debe tener al menos 2 caracteres", tipo: false });
      return;
    }
    if (form.precio <= 0) {
      setMensaje({ respuesta: "El precio debe ser mayor a 0", tipo: false });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      let dataToSend;
      let headers;
      if (imagen) {
        dataToSend = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          dataToSend.append(key, value);
        });
        dataToSend.append('imagen', imagen);
        headers = {
          Authorization: token ? `Bearer ${token}` : undefined
        };
      } else {
        dataToSend = form;
        headers = {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined
        };
      }
      if (initialData && initialData._id) {

        console.log("Actualizando producto", dataToSend);
        // Actualizar producto
        const url = `${import.meta.env.VITE_BACKEND_URL}/products/actualizarProducto/${initialData._id}`;
        await axios.put(url, dataToSend, { headers });
        setMensaje({ respuesta: "Producto actualizado correctamente", tipo: true })
        console.log(axios.put(url, dataToSend, { headers }));
      } else {
        // Agregar producto
        const url = `${import.meta.env.VITE_BACKEND_URL}/products/agregarProducto`;
        await axios.post(url, dataToSend, { headers });
        setMensaje({ respuesta: "Producto agregado correctamente", tipo: true });
      }
      setTimeout(() => {
        setForm(initialForm);
        setImagen(null);
        setPreview(null);
        setMensaje({});
        onSubmit(form);
        onClose();
      }, 1500);
    } catch (error) {
      setMensaje({ respuesta: error?.response?.data?.msg || "Ocurrió un error al guardar el producto.", tipo: false });
    }
  };


  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#102E50]">{initialData ? "Editar" : "Agregar"} Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Código Modelo</label>
              <input name="codigoModelo" value={form.codigoModelo} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input name="nombreEquipo" value={form.nombreEquipo} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input name="color" value={form.color} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacidad</label>
              <input name="capacidad" value={form.capacidad} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Precio</label>
              <input name="precio" type="number" value={form.precio} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                name="tipo" 
                value={form.tipo} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7F8CAA]" required 
                >
                <option value="">Selecciona el tipo</option>
                <option value="Openbox">Openbox</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Semi-nuevo">Semi-nuevo</option>
              </select>
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
          <div>
            <label className="block text-sm font-medium mb-1">Imagen</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 max-h-32 rounded shadow" />
            )}
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

export default ProductModal;
