import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminGeneral() {
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [egresos, setEgresos] = useState(
    JSON.parse(localStorage.getItem("egresos") || "[]")
  );
  const [nuevoEgreso, setNuevoEgreso] = useState({ descripcion: "", monto: "" });

  const [filtro, setFiltro] = useState({ desde: "", hasta: "" });
  const [filtroIngresos, setFiltroIngresos] = useState({ desde: "", hasta: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [pedidosRes, productosRes, usuariosRes] = await Promise.all([
      axios.get("/api/pedidos"),
      axios.get("/api/products"),
      axios.get("/api/users"),
    ]);
    setPedidos(pedidosRes.data);
    setProductos(productosRes.data);
    setUsuarios(usuariosRes.data);
  };

  // 🔹 Ventas filtradas
  const ventasFiltradas = pedidos.filter((p) => {
    if (!filtro.desde || !filtro.hasta) return true;
    const fecha = new Date(p.fechaEntrega);
    return fecha >= new Date(filtro.desde) && fecha <= new Date(filtro.hasta);
  });

  // 🔹 Ingresos filtrados
  const ingresosFiltrados = pedidos.filter((p) => {
    if (!filtroIngresos.desde || !filtroIngresos.hasta) return true;
    const fecha = new Date(p.fechaEntrega);
    return (
      fecha >= new Date(filtroIngresos.desde) &&
      fecha <= new Date(filtroIngresos.hasta)
    );
  });

  // Calcular ingresos totales (general y filtrado)
  const ingresosTotales = pedidos.reduce((acc, p) => acc + p.precioTotal, 0);
  const ingresosPorRango = ingresosFiltrados.reduce(
    (acc, p) => acc + p.precioTotal,
    0
  );

  // Guardar egreso
  const agregarEgreso = () => {
    if (!nuevoEgreso.descripcion || !nuevoEgreso.monto) {
      alert("Completa todos los campos del egreso");
      return;
    }

    const nuevo = {
      ...nuevoEgreso,
      monto: parseFloat(nuevoEgreso.monto),
      fecha: new Date().toISOString(),
    };
    const actualizados = [...egresos, nuevo];
    setEgresos(actualizados);
    localStorage.setItem("egresos", JSON.stringify(actualizados));
    setNuevoEgreso({ descripcion: "", monto: "" });
  };

  // 🗑️ Eliminar egreso individual
  const eliminarEgreso = (index) => {
    if (!confirm("¿Seguro que deseas eliminar este egreso?")) return;
    const actualizados = egresos.filter((_, i) => i !== index);
    setEgresos(actualizados);
    localStorage.setItem("egresos", JSON.stringify(actualizados));
  };

  // 🗑️ Eliminar venta/pedido
  const eliminarVenta = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta venta?")) return;
    try {
      await axios.delete(`/api/pedidos?id=${id}`);
      fetchData();
      alert("✅ Venta eliminada con éxito");
    } catch (err) {
      console.error(err);
      alert("❌ Error eliminando la venta");
    }
  };

  // Calcular egresos totales
  const totalEgresos = egresos.reduce((acc, e) => acc + e.monto, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Administración General
        </h1>

        {/* 🔹 Resumen general */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-600/20 p-6 rounded-lg border border-blue-600">
            <h2 className="text-xl font-semibold">💰 Ingresos Totales</h2>
            <p className="text-2xl font-bold mt-2">
              ${ingresosTotales.toLocaleString("es-AR")}
            </p>
          </div>

          <div className="bg-red-600/20 p-6 rounded-lg border border-red-600">
            <h2 className="text-xl font-semibold">💸 Egresos Totales</h2>
            <p className="text-2xl font-bold mt-2">
              ${totalEgresos.toLocaleString("es-AR")}
            </p>
          </div>

          <div className="bg-green-600/20 p-6 rounded-lg border border-green-600">
            <h2 className="text-xl font-semibold">📦 Productos</h2>
            <p className="text-2xl font-bold mt-2">{productos.length}</p>
          </div>

          <div className="bg-yellow-600/20 p-6 rounded-lg border border-yellow-600">
            <h2 className="text-xl font-semibold">👥 Usuarios</h2>
            <p className="text-2xl font-bold mt-2">{usuarios.length}</p>
          </div>
        </div>

        {/* 🔹 Ventas (por rango de fecha) */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">📊 Ventas</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400">Desde</label>
              <input
                type="date"
                value={filtro.desde}
                onChange={(e) =>
                  setFiltro({ ...filtro, desde: e.target.value })
                }
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Hasta</label>
              <input
                type="date"
                value={filtro.hasta}
                onChange={(e) =>
                  setFiltro({ ...filtro, hasta: e.target.value })
                }
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3">Cliente</th>
                <th className="p-3">Total</th>
                <th className="p-3">Fecha Entrega</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((p) => (
                <tr key={p._id} className="border-b border-gray-700">
                  <td className="p-3">
                    {p.cliente
                      ? `${p.cliente.nombre} (${p.cliente.email})`
                      : p.titularNombre || "Sin titular"}
                  </td>
                  <td className="p-3">
                    ${p.precioTotal.toLocaleString("es-AR")}
                  </td>
                  <td className="p-3">
                    {new Date(p.fechaEntrega).toLocaleDateString("es-AR")}
                  </td>
                  <td className="p-3 capitalize">{p.estado}</td>
                  <td className="p-3">
                    <button
                      onClick={() => eliminarVenta(p._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                    >
                      🗑 Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ventasFiltradas.length === 0 && (
            <p className="text-gray-400 text-center mt-4">
              No hay ventas en el rango seleccionado.
            </p>
          )}
        </div>

        {/* 🔹 Ingresos por rango de fechas */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">💰 Ingresos por rango</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400">Desde</label>
              <input
                type="date"
                value={filtroIngresos.desde}
                onChange={(e) =>
                  setFiltroIngresos({ ...filtroIngresos, desde: e.target.value })
                }
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Hasta</label>
              <input
                type="date"
                value={filtroIngresos.hasta}
                onChange={(e) =>
                  setFiltroIngresos({ ...filtroIngresos, hasta: e.target.value })
                }
                className="p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
          </div>

          <p className="text-xl">
            Ingresos entre{" "}
            <span className="font-semibold">
              {filtroIngresos.desde || "—"} y {filtroIngresos.hasta || "—"}
            </span>
            :
          </p>
          <p className="text-3xl font-bold mt-3 text-green-400">
            ${ingresosPorRango.toLocaleString("es-AR")}
          </p>
        </div>

        {/* 🔹 Egresos */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">💸 Egresos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoEgreso.descripcion}
              onChange={(e) =>
                setNuevoEgreso({ ...nuevoEgreso, descripcion: e.target.value })
              }
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
            <input
              type="number"
              placeholder="Monto"
              value={nuevoEgreso.monto}
              onChange={(e) =>
                setNuevoEgreso({ ...nuevoEgreso, monto: e.target.value })
              }
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            />
            <button
              onClick={agregarEgreso}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
            >
              ➕ Agregar Egreso
            </button>
          </div>

          <ul className="divide-y divide-gray-700">
            {egresos.map((e, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-2 text-sm text-gray-300"
              >
                <div>
                  {e.descripcion} ({new Date(e.fecha).toLocaleDateString()})
                </div>
                <div className="flex items-center gap-4">
                  <span>${e.monto.toLocaleString("es-AR")}</span>
                  <button
                    onClick={() => eliminarEgreso(i)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
