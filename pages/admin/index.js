import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const res = await axios.get("/api/pedidos");
        setPedidos(res.data);
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("No se pudieron cargar los pedidos");
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Panel de Administración
        </h1>

        {/* Sección de navegación */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          <Link
            href="/admin/productos"
            className="bg-blue-600 hover:bg-blue-700 transition py-6 px-10 rounded-lg font-semibold text-lg shadow-lg flex items-center gap-2"
          >
            🧩 Administrar Productos
          </Link>

          <Link
            href="/admin/usuarios"
            className="bg-green-600 hover:bg-green-700 transition py-6 px-10 rounded-lg font-semibold text-lg shadow-lg flex items-center gap-2"
          >
            👤 Administrar Usuarios
          </Link>

          <Link
            href="/admin/general"
            className="bg-yellow-600 hover:bg-yellow-700 transition py-6 px-10 rounded-lg font-semibold text-lg shadow-lg flex items-center gap-2"
          >
            📊 Administración General
          </Link>

          <Link
            href="/admin/pedidos"
            className="bg-purple-600 hover:bg-purple-700 transition py-6 px-10 rounded-lg font-semibold text-lg shadow-lg flex items-center gap-2"
          >
            ➕ Agregar Pedido
          </Link>
        </div>

        {/* Sección de pedidos */}
        <div className="bg-gray-900/80 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Pedidos recientes</h2>
          </div>

          {cargando && <p className="text-gray-400 text-center">Cargando pedidos...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!cargando && !error && (
            <>
              {pedidos.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Productos</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Entrega</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((p) => (
                      <tr key={p._id} className="border-b border-gray-700">
                        <td className="p-3">
                          {p.cliente?.nombre || "Cliente no registrado"}
                        </td>
                        <td className="p-3">
                          {p.productos
                            .map(
                              (prod) =>
                                `${prod.nombre} (${prod.cantidad} x $${prod.precioUnitario})`
                            )
                            .join(", ")}
                        </td>
                        <td className="p-3 font-semibold">
                          ${p.precioTotal.toLocaleString("es-AR")}
                        </td>
                        <td className="p-3">
                          {new Date(p.fechaEntrega).toLocaleDateString("es-AR")}
                        </td>
                        <td className="p-3 capitalize">{p.estado}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400 text-center mt-6">
                  No hay pedidos registrados.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
