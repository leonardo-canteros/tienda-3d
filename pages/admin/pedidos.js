import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPedidos() {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [nuevoPedido, setNuevoPedido] = useState({
    cliente: "",
    titularNombre: "",
    titularEmail: "",
    productosSeleccionados: [],
    productoActual: "",
    cantidadActual: 1,
    fechaEntrega: "",
  });

  // ===== Cargar datos iniciales =====
  useEffect(() => {
    fetchProductos();
    fetchUsuarios();
    fetchPedidos();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get("/api/products");
    setProductos(res.data);
  };

  const fetchUsuarios = async () => {
    const res = await axios.get("/api/users");
    setUsuarios(res.data);
  };

  const fetchPedidos = async () => {
    const res = await axios.get("/api/pedidos");
    setPedidos(res.data);
  };

  // ===== Manejadores =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoPedido({ ...nuevoPedido, [name]: value });
  };

  // ✅ Agregar producto a la lista temporal
  const agregarProducto = () => {
    const productoSel = productos.find((p) => p._id === nuevoPedido.productoActual);
    if (!productoSel) {
      alert("Selecciona un producto válido");
      return;
    }
    if (nuevoPedido.cantidadActual <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    const nuevoItem = {
      producto: productoSel._id,
      nombre: productoSel.nombre,
      cantidad: nuevoPedido.cantidadActual,
      precioUnitario: productoSel.precio,
    };

    setNuevoPedido((prev) => ({
      ...prev,
      productosSeleccionados: [...prev.productosSeleccionados, nuevoItem],
      productoActual: "",
      cantidadActual: 1,
    }));
  };

  // 🗑 Quitar producto de la lista
  const eliminarProducto = (index) => {
    setNuevoPedido((prev) => ({
      ...prev,
      productosSeleccionados: prev.productosSeleccionados.filter((_, i) => i !== index),
    }));
  };

  // ✅ Crear pedido con múltiples productos
  const handleCrearPedido = async () => {
    if (
      nuevoPedido.productosSeleccionados.length === 0 ||
      (!nuevoPedido.cliente && !nuevoPedido.titularNombre)
    ) {
      alert("Debe tener al menos un producto y un cliente o titular.");
      return;
    }

    const precioTotal = nuevoPedido.productosSeleccionados.reduce(
      (acc, p) => acc + p.precioUnitario * p.cantidad,
      0
    );

    const pedido = {
      cliente: nuevoPedido.cliente || null,
      titularNombre: nuevoPedido.titularNombre || null,
      titularEmail: nuevoPedido.titularEmail || null,
      productos: nuevoPedido.productosSeleccionados,
      precioTotal,
      fechaEntrega: nuevoPedido.fechaEntrega || new Date(),
      estado: "pendiente",
    };

    try {
      await axios.post("/api/pedidos", pedido);
      alert("✅ Pedido creado con éxito");
      setNuevoPedido({
        cliente: "",
        titularNombre: "",
        titularEmail: "",
        productosSeleccionados: [],
        productoActual: "",
        cantidadActual: 1,
        fechaEntrega: "",
      });
      fetchPedidos();
    } catch (err) {
      console.error(err);
      alert("❌ Error creando el pedido");
    }
  };

  // 🗑 Eliminar pedido
  const eliminarPedido = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este pedido?")) return;
    await axios.delete(`/api/pedidos?id=${id}`);
    fetchPedidos();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Administrar Pedidos</h1>

        {/* NUEVO PEDIDO */}
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Nuevo Pedido</h2>

          {/* Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              name="cliente"
              value={nuevoPedido.cliente}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              <option value="">Seleccionar cliente registrado</option>
              {usuarios.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.nombre} ({u.email})
                </option>
              ))}
            </select>

            <div>
              <input
                type="text"
                name="titularNombre"
                placeholder="Titular (si no está registrado)"
                value={nuevoPedido.titularNombre}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800 text-white border border-gray-700 w-full mb-2"
              />
              <input
                type="email"
                name="titularEmail"
                placeholder="Email del titular"
                value={nuevoPedido.titularEmail}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800 text-white border border-gray-700 w-full"
              />
            </div>
          </div>

          {/* Selección de producto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              name="productoActual"
              value={nuevoPedido.productoActual}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              <option value="">Seleccionar producto</option>
              {productos.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nombre} (${p.precio})
                </option>
              ))}
            </select>

            <input
              type="number"
              name="cantidadActual"
              min="1"
              value={nuevoPedido.cantidadActual}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            />

            <button
              onClick={agregarProducto}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold col-span-2"
            >
              ➕ Agregar Producto
            </button>
          </div>

          {/* Lista de productos seleccionados */}
          {nuevoPedido.productosSeleccionados.length > 0 && (
            <div className="bg-gray-800 p-4 rounded mb-4">
              <h3 className="font-semibold mb-2">Productos agregados</h3>
              <ul>
                {nuevoPedido.productosSeleccionados.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center border-b border-gray-700 py-2"
                  >
                    <span>
                      {p.nombre} ({p.cantidad} x ${p.precioUnitario})
                    </span>
                    <button
                      onClick={() => eliminarProducto(i)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fecha y crear pedido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input
              type="date"
              name="fechaEntrega"
              value={nuevoPedido.fechaEntrega}
              onChange={handleChange}
              className="p-2 rounded bg-gray-800 text-white border border-gray-700"
            />

            <button
              onClick={handleCrearPedido}
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white font-semibold col-span-2"
            >
              ✅ Crear Pedido
            </button>
          </div>
        </div>

        {/* LISTA DE PEDIDOS */}
        <h2 className="text-2xl font-bold mb-4">Pedidos Existentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3">Cliente</th>
                <th className="p-3">Productos</th>
                <th className="p-3">Total</th>
                <th className="p-3">Entrega</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p._id} className="border-b border-gray-700">
                  <td className="p-3">
                    {p.cliente
                      ? `${p.cliente.nombre} (${p.cliente.email})`
                      : p.titularNombre || "Sin titular"}
                  </td>
                  <td className="p-3">
                    {p.productos
                      .map(
                        (prod) =>
                          `${prod.nombre} (${prod.cantidad} x $${prod.precioUnitario})`
                      )
                      .join(", ")}
                  </td>
                  <td className="p-3">${p.precioTotal.toLocaleString("es-AR")}</td>
                  <td className="p-3">
                    {new Date(p.fechaEntrega).toLocaleDateString("es-AR")}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => eliminarPedido(p._id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pedidos.length === 0 && (
            <p className="text-gray-400 text-center mt-6">
              No hay pedidos registrados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
