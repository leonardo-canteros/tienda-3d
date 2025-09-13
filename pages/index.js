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
    <div className="page-container">
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center h-[500px] flex items-center"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }} // dragón/ciudad
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              BRINGING YOUR IMAGINATION <br /> TO TANGIBLE REALITY
            </h1>
            <p className="mt-4 text-lg text-gray-200">
              Diseños personalizados en impresión 3D para tus proyectos únicos.
            </p>
            <a
              href="#catalogo"
              className="inline-block mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-lg font-semibold transition"
            >
              Explore Designs
            </a>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <main className="max-w-6xl mx-auto p-6" id="catalogo">
        <h2 className="text-3xl font-bold mb-6 text-white">Catálogo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition"
            >
              <div onClick={() => setSelected(p)} className="cursor-pointer">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="text-xl font-semibold mt-4">{p.nombre}</h3>
                <p className="text-gray-600">
                  ${p.precio.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <ProductModal product={selected} onClose={() => setSelected(null)} />
        )}
      </main>
    </div>
  );
}
