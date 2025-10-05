import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    rol: "user",
    direccion: {
      calle: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      pais: "",
    },
  });

  const cargarUsuarios = async () => {
    const res = await axios.get("/api/users");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 🔹 Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("direccion.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        direccion: { ...form.direccion, [field]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🔹 Enviar actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editId) return;

    await axios.put(`/api/users?id=${editId}`, form);
    setEditId(null);
    setForm({
      nombre: "",
      email: "",
      rol: "user",
      direccion: {
        calle: "",
        ciudad: "",
        provincia: "",
        codigoPostal: "",
        pais: "",
      },
    });
    cargarUsuarios();
  };

  // 🔹 Seleccionar usuario para editar
  const handleEdit = (u) => {
    setEditId(u._id);
    setForm({
      nombre: u.nombre || "",
      email: u.email || "",
      rol: u.rol || "user",
      direccion: {
        calle: u.direccion?.calle || "",
        ciudad: u.direccion?.ciudad || "",
        provincia: u.direccion?.provincia || "",
        codigoPostal: u.direccion?.codigoPostal || "",
        pais: u.direccion?.pais || "",
      },
    });
  };

  // 🔹 Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (confirm("¿Seguro que querés eliminar este usuario?")) {
      await axios.delete(`/api/users?id=${id}`);
      cargarUsuarios();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Administrar Usuarios</h1>

        {/* Formulario de edición */}
        {editId && (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/80 p-6 rounded-lg shadow space-y-4 mb-10"
          >
            <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="direccion.calle"
                value={form.direccion.calle}
                onChange={handleChange}
                placeholder="Calle"
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
              <input
                name="direccion.ciudad"
                value={form.direccion.ciudad}
                onChange={handleChange}
                placeholder="Ciudad"
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                name="direccion.provincia"
                value={form.direccion.provincia}
                onChange={handleChange}
                placeholder="Provincia"
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
              <input
                name="direccion.codigoPostal"
                value={form.direccion.codigoPostal}
                onChange={handleChange}
                placeholder="Código Postal"
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
              <input
                name="direccion.pais"
                value={form.direccion.pais}
                onChange={handleChange}
                placeholder="País"
                className="p-2 rounded bg-gray-800 text-gray-200"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Rol</label>
              <select
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="p-2 rounded bg-gray-800 text-gray-200"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Tabla de usuarios */}
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id} className="border-b border-gray-700">
                <td className="p-3">{u.nombre}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      u.rol === "admin"
                        ? "bg-blue-700"
                        : "bg-gray-700"
                    }`}
                  >
                    {u.rol}
                  </span>
                </td>
                <td className="p-3 text-gray-300">
                  {u.direccion?.ciudad ? (
                    <>
                      {u.direccion.calle || "—"}, {u.direccion.ciudad},{" "}
                      {u.direccion.provincia}
                    </>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-black font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u._id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {usuarios.length === 0 && (
          <p className="text-gray-400 text-center mt-8">
            No hay usuarios registrados todavía.
          </p>
        )}
      </div>
    </div>
  );
}
