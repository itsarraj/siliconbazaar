import asyncHandler from "express-async-handler";
import {
  countAvailableProducts,
  findAvailableProducts,
} from "../../lib/repositories.js";
import { serializeProduct } from "../../lib/serializers.js";

const getProducts = asyncHandler(async (req, res) => {
  const noOfProductsPerPage = 8;
  const page = Number(req.query.page) || 1;

  const [products, totalProducts] = await Promise.all([
    findAvailableProducts(page, noOfProductsPerPage),
    countAvailableProducts(),
  ]);

  const pages = Math.ceil(totalProducts / noOfProductsPerPage);
  res.status(200).json({
    products: products.map(serializeProduct),
    page,
    pages,
  });
});

export default getProducts;
