import React from "react";

const TradeinTable = ({ tradeins, onEdit, onDelete }) => (
  <div className="w-full h-full flex flex-col">
    <div className="w-full flex-1">
      <div className="overflow-x-auto w-full relative rounded-lg shadow-sm">
        <table className="min-w-[700px] max-w-full w-full bg-white border rounded-lg text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-[#B8CFCE]">
              <th className="py-2 px-4 text-left">Nombre Equipo</th>
              <th className="py-2 px-4 text-left">Valor Máximo</th>
              <th className="py-2 px-4 text-left">Valor Mínimo</th>
              <th className="py-2 px-4 text-left">Categoría</th>
              <th className="py-2 px-4 text-left">Responsable</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tradeins.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">No hay trade-in registrados.</td>
              </tr>
            ) : (
              tradeins.map((tradein) => (
                <tr key={tradein._id} className="border-t hover:bg-[#EAEFEF] transition">
                  <td className="py-2 px-4 max-w-[120px] truncate" title={tradein.nombreEquipo}>{tradein.nombreEquipo}</td>
                  <td className="py-2 px-4">${tradein.valorMaximo}</td>
                  <td className="py-2 px-4">${tradein.valorMinimo}</td>
                  <td className="py-2 px-4">{Array.isArray(tradein.categoriaNombre) ? tradein.categoriaNombre[0]?.nombreCategoria : tradein.categoriaNombre?.nombreCategoria}</td>
                  <td className="py-2 px-4">{Array.isArray(tradein.responsable) ? tradein.responsable[0]?.nombre : tradein.responsable?.nombre}</td>
                  <td className="py-2 px-4 flex flex-col sm:flex-row justify-center gap-2">
                    <button onClick={() => onEdit(tradein)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded text-xs sm:text-sm">Editar</button>
                    <button onClick={() => onDelete(tradein._id)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded text-xs sm:text-sm">Eliminar</button>
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
  </div>
);

export default TradeinTable;
