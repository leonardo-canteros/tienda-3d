// pages/catalogo.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((res) => {
      setProductos(res.data);
      setFiltrados(res.data);
      // generar lista de categorías únicas
      const cats = [...new Set(res.data.map((p) => p.categoria))];
      setCategorias(["Todos", ...cats]);
    });
  }, []);

  // 🔍 Filtrar productos cuando cambia búsqueda o categoría
  useEffect(() => {
    let resultado = productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (categoria !== "Todos") {
      resultado = resultado.filter((p) => p.categoria === categoria);
    }

    setFiltrados(resultado);
  }, [busqueda, categoria, productos]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Catálogo</h1>

        {/* Barra de búsqueda y categorías */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <SearchBar value={busqueda} onChange={setBusqueda} />
          <CategoryFilter
            categorias={categorias}
            categoriaSeleccionada={categoria}
            onSelect={setCategoria}
          />
        </div>

        {/* Productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtrados.length > 0 ? (
            filtrados.map((p) => <ProductCard key={p._id} producto={p} />)
          ) : (
            <p className="col-span-full text-center text-gray-400">
              No se encontraron productos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
