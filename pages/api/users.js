// pages/api/users.js
import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  try {
    switch (req.method) {
      // 📖 GET - Obtener todos los usuarios o uno por ID
      case "GET":
        if (id) {
          const user = await User.findById(id, "-password");
          if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
          return res.status(200).json(user);
        }

        const users = await User.find({}, "-password"); // sin password
        return res.status(200).json(users);

      // ✏️ PUT - Actualizar usuario (ej. rol, dirección, etc.)
      case "PUT":
        if (!id) return res.status(400).json({ message: "Falta el id" });
        const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated)
          return res.status(404).json({ message: "Usuario no encontrado" });
        return res.status(200).json(updated);

      // ❌ DELETE - Eliminar usuario
      case "DELETE":
        if (!id) return res.status(400).json({ message: "Falta el id" });
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted)
          return res.status(404).json({ message: "Usuario no encontrado" });
        return res.status(200).json({ message: "Usuario eliminado" });

      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error("Error en /api/users:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
}
