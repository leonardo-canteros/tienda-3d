import dbConnect from "../../lib/dbConnect";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await dbConnect();

  const { slug, id } = req.query;

  try {
    switch (req.method) {
      // 📌 READ - Todos los productos o por slug
      case "GET":
        if (slug) {
          const product = await Product.findOne({ slug });
          if (!product) return res.status(404).json({ message: "No encontrado" });
          return res.status(200).json(product);
        }
        const products = await Product.find({});
        return res.status(200).json(products);

      // 📌 CREATE - Crear nuevo producto
      
      case "POST":
          try {
            const body = req.body;

            // 🔹 Generamos slug 
            const slug = body.nombre
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

            const newProduct = new Product({ ...body, slug });
            await newProduct.save();

            return res.status(201).json(newProduct);
          } catch (error) {
            console.error("❌ Error creando producto:", error.message);
            return res.status(500).json({ message: "Error interno", error: error.message });
          }



      // 📌 UPDATE - Editar producto por id
      case "PUT":
        if (!id) return res.status(400).json({ message: "Falta el id" });
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updatedProduct) return res.status(404).json({ message: "No encontrado" });
        return res.status(200).json(updatedProduct);

      // 📌 DELETE - Borrar producto por id
      case "DELETE":
        if (!id) return res.status(400).json({ message: "Falta el id" });
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "No encontrado" });
        return res.status(200).json({ message: "Producto eliminado" });

      default:
        return res.status(405).json({ message: "Método no permitido" });
    }
  }  catch (error) {
      console.error("Error en /api/products:", error.message, error);
      return res.status(500).json({
        message: "Error interno",
        error: error.message, // 👈 mostramos el mensaje real
      });
    }

}
