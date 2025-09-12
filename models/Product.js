import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    especificaciones: { type: [String], default: [] }, // 👈 NUEVO
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
