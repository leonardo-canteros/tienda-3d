import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default NextAuth({
  providers: [
    // 🔹 Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // 🔹 Login con email y contraseña
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Usuario no encontrado");

        const valido = await bcrypt.compare(credentials.password, user.password);
        if (!valido) throw new Error("Contraseña incorrecta");

        // 🔹 Devolvemos el usuario completo, incluyendo rol
        return {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        };
      },
    }),
  ],

  // 🔹 Página personalizada de login
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🧩 Guardamos el rol dentro del token JWT
    async jwt({ token, user }) {
      if (user) {
        token.rol = user.rol || "user"; // si no tiene rol, por defecto "user"
      }
      return token;
    },

    // 🧠 Pasamos el rol del token a la sesión del usuario
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.rol = token.rol || "user";
      }
      return session;
    },
  },
});
