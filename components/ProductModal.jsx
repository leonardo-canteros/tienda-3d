// components/ProductModal.jsx
export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose} // cerrar al hacer click en el fondo
    >
      <div
        className="bg-white rounded-lg w-[90%] max-w-md p-6 relative animate-fadeIn shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
        >
          ✖
        </button>

        {/* Imagen */}
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-64 object-cover rounded"
        />

        {/* Info */}
        <h2 className="text-2xl font-bold mt-4">{product.nombre}</h2>
        <p className="text-gray-700 mt-2">{product.descripcion}</p>
        <p className="text-green-600 text-xl font-semibold mt-4">
          ${product.precio.toLocaleString("es-AR")}
        </p>

        {/* Botón WhatsApp */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola,%20me%20interesa%20el%20producto%20${encodeURIComponent(
            product.nombre
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Comprar por WhatsApp
        </a>
      </div>
    </div>
  );
}
