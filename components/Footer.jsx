export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Info */}
        <div>
          <h3 className="text-lg font-semibold text-white">Tienda 3D</h3>
          <p className="mt-2 text-sm">
            Catálogo de productos impresos en 3D, personalizados y únicos.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Enlaces</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="/" className="hover:underline">Inicio</a></li>
            <li><a href="/#catalogo" className="hover:underline">Catálogo</a></li>
            <li><a href="/contacto" className="hover:underline">Contacto</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white">Contacto</h3>
          <p className="mt-2">WhatsApp: +54 9 379 404 2531</p>
          <p>Email: contacto@tu-tienda.com</p>
        </div>
      </div>

      <div className="bg-gray-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} Tienda 3D. Todos los derechos reservados.
      </div>
    </footer>
  );
}
