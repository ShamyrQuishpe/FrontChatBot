import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete }) => (
  <div className="relative w-full overflow-x-auto rounded-lg shadow-sm scrollbar-thin scrollbar-thumb-[#B8CFCE] scrollbar-track-[#EAEFEF]">
    {/* Sombra scroll para móvil */}
    <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white/90 to-transparent hidden sm:block" />
    <table className="min-w-[600px] w-full bg-white border rounded-lg text-sm">
      <thead>
        <tr className="bg-[#B8CFCE]">
          <th className="py-2 px-4 text-left max-w-[180px] truncate">Nombre</th>
          <th className="py-2 px-4 text-left max-w-[300px] truncate">Descripción</th>
          <th className="py-2 px-4 text-center w-32">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categories.length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center py-4 text-gray-400">No hay categorías registradas.</td>
          </tr>
        ) : (
          categories.map((cat) => (
            <tr key={cat._id} className="border-t hover:bg-[#F5F7FA] transition">
              <td className="py-2 px-4 max-w-[180px] truncate" title={cat.nombreCategoria}>{cat.nombreCategoria}</td>
              <td className="py-2 px-4 max-w-[300px] truncate" title={cat.descripcionCategoria}>{cat.descripcionCategoria}</td>
              <td className="py-2 px-4 flex justify-center gap-2 w-32">
                <button onClick={() => onEdit(cat)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded text-xs">Editar</button>
                <button onClick={() => onDelete(cat._id)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded text-xs">Eliminar</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
    {/* Indicador de scroll para móvil */}
    <div className="sm:hidden text-xs text-gray-400 text-right mt-1 pr-2 select-none">Desliza la tabla &rarr;</div>
  </div>
);

export default CategoryTable;
