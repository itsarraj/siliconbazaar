import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { serializeProduct } from "../../lib/serializers.js";

const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (product) {
    res.status(200).json(serializeProduct(product));
  } else {
    const message = "Product is unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default getProduct;
