import dbConnect from "../../lib/dbConnect";
import Pedido from "../../models/Pedido";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  try {
    switch (req.method) {
      // 📦 GET - Listar pedidos
      case "GET":
        const pedidos = await Pedido.find({})
          .populate("cliente", "nombre email") // trae datos del cliente
          .populate("productos.producto", "nombre precio"); // muestra info del producto
        return res.status(200).json(pedidos);

      // 🆕 POST - Crear pedido
      case "POST":
        const nuevoPedido = new Pedido(req.body);
        await nuevoPedido.save();
        return res.status(201).json(nuevoPedido);

      // ✏️ PUT - Actualizar pedido (ej. estado)
      case "PUT":
        if (!id) return res.status(400).json({ message: "Falta el id del pedido" });

        const actualizado = await Pedido.findByIdAndUpdate(id, req.body, {
          new: true,
        });

        if (!actualizado)
          return res.status(404).json({ message: "Pedido no encontrado" });

        return res.status(200).json(actualizado);

      // ❌ DELETE - Eliminar pedido
      case "DELETE":
        if (!id) return res.status(400).json({ message: "Falta el id del pedido" });
        const eliminado = await Pedido.findByIdAndDelete(id);
        if (!eliminado)
          return res.status(404).json({ message: "Pedido no encontrado" });
        return res.status(200).json({ message: "Pedido eliminado correctamente" });

      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  } catch (error) {
    console.error("Error en /api/pedidos:", error);
    return res
      .status(500)
      .json({ message: "Error interno", error: error.message });
  }
}
