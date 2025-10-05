import mongoose from "mongoose";

const ProductoPedidoSchema = new mongoose.Schema(
  {
    producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
  },
  { _id: false } // no necesitamos un id para cada subdocumento
);

const PedidoSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    titularNombre: { type: String },
    titularEmail: { type: String },
    productos: [ProductoPedidoSchema], // 👈 este array sí contiene 'producto'
    precioTotal: { type: Number, required: true },
    fechaEntrega: { type: Date, required: true },
    estado: {
      type: String,
      enum: ["pendiente", "en proceso", "entregado", "cancelado"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);
