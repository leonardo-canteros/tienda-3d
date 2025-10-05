// components/ProductCard.jsx
import Link from "next/link";

export default function ProductCard({ producto }) {
  return (
    <div className="bg-white text-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-52 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{producto.nombre}</h3>
        <p className="text-gray-500">{producto.categoria}</p>
        <p className="text-blue-600 font-bold mt-2">
          ${producto.precio.toLocaleString("es-AR")}
        </p>
        <Link
          href={`/producto/${producto.slug}`}
          className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}
