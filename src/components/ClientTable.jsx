import React from "react";



const ClientTable = ({ clients, onEdit, onDelete }) => (
  <div className="w-full h-full flex flex-col">
    {/* Scroll horizontal solo en la tabla, con sombra visual UX en móvil */}
    <div className="w-full flex-1">
      <div className="overflow-x-auto w-full relative rounded-lg shadow-sm">
        <table className="min-w-[700px] max-w-full w-full bg-white border rounded-lg text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-[#B8CFCE]">
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Nombre</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Apellido</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Cédula</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Teléfono</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap max-w-[120px] truncate">Email</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Área</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Rol</th>
              <th className="py-2 px-2 sm:px-4 text-left whitespace-nowrap">Estado</th>
              <th className="py-2 px-2 sm:px-4 text-center whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-400">No hay clientes registrados.</td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client._id} className="border-t hover:bg-[#EAEFEF] transition">
                  <td className="py-2 px-2 sm:px-4 max-w-[100px] truncate" title={client.nombre}>{client.nombre}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[100px] truncate" title={client.apellido}>{client.apellido}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[90px] truncate" title={client.cedula}>{client.cedula}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[100px] truncate" title={client.telefono}>{client.telefono}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[120px] truncate" title={client.email}>{client.email}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[90px] truncate" title={client.area}>{client.area}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[80px] truncate" title={client.rol}>{client.rol}</td>
                  <td className="py-2 px-2 sm:px-4 max-w-[80px] truncate" title={client.status}>{client.status}</td>
                  <td className="py-2 px-2 sm:px-4 flex flex-col sm:flex-row justify-center gap-2">
                    <button onClick={() => onEdit(client)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded text-xs sm:text-sm">Editar</button>
                    <button onClick={() => onDelete(client._id)} className="bg-[#333446] hover:bg-[#7F8CAA] text-white px-3 py-1 rounded text-xs sm:text-sm">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Sombra visual UX para indicar scroll en móvil */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent hidden sm:block" />
      </div>
    </div>
    {/* Ayuda visual para scroll en móvil */}
    <div className="sm:hidden text-xs text-gray-400 mt-1 text-center">Desliza la tabla &rarr;</div>
  </div>
);

export default ClientTable;
