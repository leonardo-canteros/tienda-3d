import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);

  return (
    <nav className="sticky top-0 w-full z-50 bg-gray-900/90 shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Paraná 3D
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6 text-gray-300 items-center">
          <Link href="/" className="hover:text-white transition">
            Inicio
          </Link>
          <Link href="/catalogo" className="hover:text-white transition">
            Catálogo
          </Link>
          <Link href="/contacto" className="hover:text-white transition">
            Contacto
          </Link>

          {/* Menú Admin */}
          {session?.user?.rol === "admin" && (
            <div className="relative">
              <button
                onClick={toggleAdminMenu}
                className="hover:text-white transition flex items-center gap-1"
              >
                Admin ▼
              </button>

              {adminMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                  <Link
                    href="/admin"
                    className="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    Panel Principal
                  </Link>
                  <Link
                    href="/admin/productos"
                    className="block px-4 py-2 hover:bg-gray-700"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    Productos
                  </Link>
                  <Link
                    href="/admin/usuarios"
                    className="block px-4 py-2 hover:bg-gray-700 rounded-b-lg"
                    onClick={() => setAdminMenuOpen(false)}
                  >
                    Usuarios
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex items-center space-x-3">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola,%20quiero%20hacer%20una%20consulta`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            WhatsApp
          </a>
          {session ? (
            <button
              onClick={() => signOut()}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
