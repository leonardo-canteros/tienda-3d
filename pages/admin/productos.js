import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: "",
  });
  const [editId, setEditId] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const cargarProductos = async () => {
    const res = await axios.get("/api/products");
    setProductos(res.data);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🧩 manejo de imagen (drag & drop o selección)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagenPreview(url);
      setForm({ ...form, imagen: url }); // si más adelante subís al servidor, reemplazás aquí
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagenPreview(url);
      setForm({ ...form, imagen: url });
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`/api/products?id=${editId}`, form);
    } else {
      await axios.post("/api/products", form);
    }

    setForm({ nombre: "", descripcion: "", precio: "", imagen: "", categoria: "" });
    setImagenPreview(null);
    setEditId(null);
    cargarProductos();
  };

  const handleEdit = (producto) => {
    setForm(producto);
    setImagenPreview(producto.imagen);
    setEditId(producto._id);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Seguro que querés eliminar este producto?")) {
      await axios.delete(`/api/products?id=${id}`);
      cargarProductos();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Administrar Productos</h1>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 p-6 rounded-lg shadow space-y-4 mb-10"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="p-2 rounded bg-gray-800 text-gray-200"
            />
            <input
              name="precio"
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              required
              className="p-2 rounded bg-gray-800 text-gray-200"
            />
            <input
              name="categoria"
              placeholder="Categoría"
              value={form.categoria}
              onChange={handleChange}
              required
              className="p-2 rounded bg-gray-800 text-gray-200"
            />
          </div>

          {/* 🖼️ Imagen con drag & drop */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
          >
            {imagenPreview ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={imagenPreview}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagenPreview(null);
                    setForm({ ...form, imagen: "" });
                  }}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Quitar imagen
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-400">
                  Arrastrá una imagen o{" "}
                  <label className="text-blue-400 underline cursor-pointer">
                    seleccioná una
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
              </>
            )}
          </div>

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            required
            className="w-full p-2 rounded bg-gray-800 text-gray-200"
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
          >
            {editId ? "Actualizar producto" : "Agregar producto"}
          </button>
        </form>

        {/* Tabla de productos */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id} className="border-b border-gray-700">
                <td className="p-3">{p.nombre}</td>
                <td className="p-3">${p.precio.toLocaleString("es-AR")}</td>
                <td className="p-3">{p.categoria}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
