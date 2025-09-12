// pages/producto/[slug].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("descripcion");

  useEffect(() => {
    if (slug) {
      axios.get(`/api/products?slug=${slug}`).then((res) => {
        setProduct(res.data.product);
        setRelated(res.data.related);
      });
    }
  }, [slug]);

  if (!product) return <p className="p-6">Cargando...</p>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Columna izquierda: Imagen */}
        <div>
          <img
            src={product.imagen}
            alt={product.nombre}
            className="w-full rounded-lg shadow mb-4"
          />
          {/* miniaturas (simuladas, por ahora es la misma imagen repetida) */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={product.imagen}
                alt={product.nombre}
                className="h-20 object-cover rounded border cursor-pointer hover:border-green-500"
              />
            ))}
          </div>
        </div>

        {/* Columna derecha: Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.nombre}</h1>
          <p className="text-green-600 text-2xl font-semibold mt-2">
            ${product.precio.toLocaleString("es-AR")}
          </p>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20el%20producto%20${encodeURIComponent(
              product.nombre
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
          >
            Comprar por WhatsApp
          </a>

          {/* Tabs */}
          <div className="mt-6">
            <div className="flex space-x-4 border-b">
              {["descripcion", "especificaciones", "reviews"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 px-3 ${
                    tab === t
                      ? "border-b-2 border-green-500 font-semibold text-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {t === "descripcion"
                    ? "Descripción"
                    : t === "especificaciones"
                    ? "Especificaciones"
                    : "Opiniones"}
                </button>
              ))}
            </div>

            <div className="mt-4 text-gray-700">
              {tab === "descripcion" && <p>{product.descripcion}</p>}
              {tab === "especificaciones" && (
                <ul className="list-disc list-inside">
                  {product.especificaciones?.length ? (
                    product.especificaciones.map((esp, i) => (
                      <li key={i}>{esp}</li>
                    ))
                  ) : (
                    <p>No hay especificaciones cargadas.</p>
                  )}
                </ul>
              )}
              {tab === "reviews" && <p>Sin opiniones por ahora.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {related.map((p) => (
            <Link
              key={p._id}
              href={`/producto/${p.slug}`}
              className="border rounded-lg shadow bg-white hover:shadow-lg transition p-4"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{p.nombre}</h3>
              <p className="text-gray-600">
                ${p.precio.toLocaleString("es-AR")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
