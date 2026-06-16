import asyncHandler from "express-async-handler";
import { findProductById } from "../../lib/repositories.js";
import { serializeProduct } from "../../lib/serializers.js";

const getProduct = asyncHandler(async (req, res) => {
  const product = await findProductById(req.params.id);
  if (product) {
    res.status(200).json(serializeProduct(product));
  } else {
    const message = "Product is unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default getProduct;
