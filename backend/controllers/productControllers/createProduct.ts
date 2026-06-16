import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { uploadProductImage } from "../../services/uploadService.js";
import { serializeProduct } from "../../lib/serializers.js";

const createProduct = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { name, price, qtyInStock } = req.body as {
    name: string;
    price: string | number;
    qtyInStock: string | number;
  };

  const image = req.file;
  if (!image) {
    res.status(400);
    throw new Error("Product image is required");
  }

  const imageUrl = await uploadProductImage(
    image.buffer,
    image.originalname,
    image.mimetype
  );

  const product = await prisma.product.create({
    data: {
      userId,
      name,
      image: imageUrl,
      price: Number(price),
      qtyInStock: Number(qtyInStock) > 0 ? Number(qtyInStock) : 1,
    },
  });

  res.status(200).json(serializeProduct(product));
});

export default createProduct;
