// pages/admin.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: "",
    especificaciones: "",
  });

  // Cargar productos existentes
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data);
  };

  // Manejar cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Crear producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/products", {
        ...form,
        precio: Number(form.precio),
        especificaciones: form.especificaciones
          .split(",")
          .map((s) => s.trim()), // pasa de string a array
      });
      alert("Producto creado con éxito ✅");
      setForm({
        nombre: "",
        slug: "",
        descripcion: "",
        precio: "",
        imagen: "",
        categoria: "",
        especificaciones: "",
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Error creando producto ❌");
    }
  };

  // Eliminar producto
  const deleteProduct = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
    await axios.delete(`/api/products?id=${id}`);
    fetchProducts();
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel Admin</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 border p-6 rounded-lg shadow bg-white"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría (ej: llaveros, lamparas)"
          value={form.categoria}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="imagen"
          placeholder="URL de la imagen"
          value={form.imagen}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          required
        />
        <input
          type="text"
          name="especificaciones"
          placeholder="Especificaciones (separadas por coma)"
          value={form.especificaciones}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 col-span-2"
        >
          Crear producto
        </button>
      </form>

      {/* Lista de productos */}
      <h2 className="text-2xl font-bold mb-4">Productos existentes</h2>
      <div className="grid gap-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="border rounded-lg p-4 flex justify-between items-center bg-white shadow"
          >
            <div>
              <h3 className="font-semibold">{p.nombre}</h3>
              <p className="text-sm text-gray-600">{p.categoria}</p>
              <p className="text-sm text-gray-600">
                ${p.precio.toLocaleString("es-AR")}
              </p>
            </div>
            <button
              onClick={() => deleteProduct(p._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
