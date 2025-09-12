// pages/producto/[slug].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      axios
        .get(`/api/products?slug=${slug}`)
        .then((res) => {
          setProduct(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error cargando producto:", err);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Cargando...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500 mt-10">Producto no encontrado</p>;
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Imagen */}
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full rounded-lg shadow-lg"
        />

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.nombre}</h1>
          <p className="text-gray-700 mb-4">{product.descripcion}</p>
          <p className="text-green-600 text-2xl font-semibold mb-6">
            ${product.precio.toLocaleString("es-AR")}
          </p>

          {/* Especificaciones */}
          {product.especificaciones?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Especificaciones:</h2>
              <ul className="list-disc list-inside text-gray-600">
                {product.especificaciones.map((esp, i) => (
                  <li key={i}>{esp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20el%20producto%20${encodeURIComponent(
              product.nombre
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
