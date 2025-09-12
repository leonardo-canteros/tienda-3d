import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    imagen: { type: String, required: true },
    categoria: { type: String, required: true },
    especificaciones: { type: [String], default: [] },
  },
  { timestamps: true }
);

// 🔹 Generar slug automáticamente antes de guardar
ProductSchema.pre("validate", function (next) {
  if (this.nombre && !this.slug) {
    this.slug = this.nombre
      .toLowerCase()
      .normalize("NFD") // quita acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-") // reemplaza espacios y caracteres raros
      .replace(/^-+|-+$/g, ""); // quita guiones al inicio y final
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
