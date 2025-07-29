
import React, { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [showImg, setShowImg] = useState(null);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex-1">
        <div className="overflow-x-auto w-full relative rounded-lg shadow-sm">
          <table className="min-w-[700px] max-w-full w-full bg-white border rounded-lg text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="bg-[#B8CFCE]">
                <th className="py-2 px-4 text-left">Código Modelo</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Color</th>
                <th className="py-2 px-4 text-left">Capacidad</th>
                <th className="py-2 px-4 text-left">Precio</th>
                <th className="py-2 px-4 text-left">Tipo</th>
                <th className="py-2 px-4 text-left">Estado</th>
                <th className="py-2 px-4 text-left">Categoría</th>
                <th className="py-2 px-4 text-center">Imagen</th>
                <th className="py-2 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-400">No hay productos registrados.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="py-2 px-4">{product.codigoModelo}</td>
                    <td className="py-2 px-4">{product.nombreEquipo}</td>
                    <td className="py-2 px-4">{product.color}</td>
                    <td className="py-2 px-4">{product.capacidad}</td>
                    <td className="py-2 px-4">${product.precio}</td>
                    <td className="py-2 px-4">{product.tipo}</td>
                    <td className="py-2 px-4">{product.estado}</td>
                    <td className="py-2 px-4">{product.categoriaNombre[0]?.nombreCategoria || ''}</td>
                    <td className="py-2 px-4 text-center">
                      {product.imagen?.url ? (
                        <button onClick={() => setShowImg(product.imagen.url)} title="Ver imagen" className="text-[#333446] hover:text-[#7F8CAA]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.83-5.17A10.97 10.97 0 0121 12c0 2.21-.64 4.27-1.74 6M6.17 6.83A10.97 10.97 0 003 12c0 2.21.64 4.27 1.74 6m2.43-2.43A6.97 6.97 0 0112 19a6.97 6.97 0 014.83-1.83m2.43-2.43A6.97 6.97 0 0012 5a6.97 6.97 0 00-4.83 1.83" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-2 px-4 flex justify-center gap-2">
                      <button onClick={() => onEdit(product)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded">Editar</button>
                      <button onClick={() => onDelete(product._id)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent hidden sm:block" />
        </div>
      </div>
      <div className="sm:hidden text-xs text-gray-400 mt-1 text-center">Desliza la tabla &rarr;</div>
      {/* Modal para mostrar imagen */}
      {showImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setShowImg(null)}>
          <div className="bg-white p-4 rounded shadow-lg max-w-xs max-h-[80vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={showImg} alt="Producto" className="max-h-64 object-contain rounded" />
            <button onClick={() => setShowImg(null)} className="mt-4 px-4 py-1 bg-[#7F8CAA] text-white rounded hover:bg-[#333446]">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
