import asyncHandler from "express-async-handler";
import prisma from "../../lib/prisma.js";
import { serializeProduct } from "../../lib/serializers.js";

const getProducts = asyncHandler(async (req, res) => {
  const noOfProductsPerPage = 8;
  const page = Number(req.query.page) || 1;
  const skip = noOfProductsPerPage * (page - 1);

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isAvailable: true },
      skip,
      take: noOfProductsPerPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: { isAvailable: true } }),
  ]);

  const pages = Math.ceil(totalProducts / noOfProductsPerPage);
  res.status(200).json({
    products: products.map(serializeProduct),
    page,
    pages,
  });
});

export default getProducts;
