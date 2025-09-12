// pages/index.js
import { useEffect, useState } from "react";
import axios from "axios";
import ProductModal from "../components/ProductModal";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition"
          >
            {/* Imagen y texto abren modal */}
            <div
              onClick={() => setSelected(p)}
              className="cursor-pointer"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-xl font-semibold mt-4">{p.nombre}</h2>
              <p className="text-gray-600">
                ${p.precio.toLocaleString("es-AR")}
              </p>
            </div>

           
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
