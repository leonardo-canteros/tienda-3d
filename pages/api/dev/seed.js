// pages/api/dev/seed.js
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  try {
    await dbConnect();

    const seedProducts = [
      {
        nombre: "Modular Planter",
        slug: "modular-planter",
        descripcion: "Maceta modular impresa en 3D.",
        precio: 75000,
        imagen: "/images/planter.jpg",
      },
      {
        nombre: "Geometric Lamp",
        slug: "geometric-lamp",
        descripcion: "Lámpara geométrica minimalista.",
        precio: 120000,
        imagen: "/images/lamp.jpg",
      },
      {
        nombre: "Phone Stand",
        slug: "phone-stand",
        descripcion: "Soporte de teléfono personalizado.",
        precio: 32000,
        imagen: "/images/stand.jpg",
      },
    ];

    // Limpia y carga de nuevo
    await Product.deleteMany({});
    const products = await Product.insertMany(seedProducts);

    return res.status(201).json({
      message: "Productos insertados correctamente",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error en seed:", error);
    return res.status(500).json({ message: "Error en seed", error });
  }
}
