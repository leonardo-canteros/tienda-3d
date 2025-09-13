import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 w-full z-50 bg-gray-900/90 shadow">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="text-2xl font-bold text-white">
      Tienda 3D
    </Link>

    {/* Links */}
    <div className="hidden md:flex space-x-6 text-gray-300">
      <Link href="/" className="hover:text-white transition">Inicio</Link>
      <Link href="/#catalogo" className="hover:text-white transition">Catálogo</Link>
      <Link href="/contacto" className="hover:text-white transition">Contacto</Link>
      {session?.user?.role === "admin" && (
        <Link href="/admin" className="hover:text-white transition">Admin</Link>
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
