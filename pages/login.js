import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/", // 👈 redirige al inicio después de loguear
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

        {/* Login con email */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white font-semibold"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-2 text-gray-400">o</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-semibold"
        >
          Iniciar sesión con Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-2 text-gray-400">o</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Botón de registro */}
        <Link
          href="/register"
          className="block w-full text-center bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
