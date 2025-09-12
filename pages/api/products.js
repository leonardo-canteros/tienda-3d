// pages/api/products.js
import dbConnect from "../../lib/dbConnect";
import Product from "../../models/Product";

export default async function handler(req, res) {
  await dbConnect();

  const { slug } = req.query;

  if (req.method === "GET") {
    if (slug) {
      const product = await Product.findOne({ slug });
      if (!product) return res.status(404).json({ message: "No encontrado" });

      const related = await Product.find({ _id: { $ne: product._id } })
        .limit(3)
        .lean();

      return res.status(200).json({ product, related });
    }

    const productos = await Product.find({});
    return res.status(200).json(productos);
  }

  return res.status(405).json({ message: "Método no permitido" });
}
