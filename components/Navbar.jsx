// components/Navbar.jsx
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo / Nombre */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Tienda 3D
        </Link>

        {/* Links */}
        <div className="space-x-6 hidden sm:flex">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Inicio
          </Link>
          <Link href="/#catalogo" className="text-gray-600 hover:text-gray-900">
            Catálogo
          </Link>
          <Link href="/contacto" className="text-gray-600 hover:text-gray-900">
            Contacto
          </Link>

          {/* Solo visible si es admin */}
          {session?.user?.rol === "admin" && (
            <Link
              href="/admin"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola,%20quiero%20hacer%20una%20consulta`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            WhatsApp
          </a>

          {/* Autenticación */}
          {!session ? (
            <button
              onClick={() => signIn()}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
