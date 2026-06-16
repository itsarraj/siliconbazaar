import asyncHandler from "express-async-handler";
import {
  findProductById,
  updateProductAvailability,
} from "../../lib/repositories.js";
import { serializeProduct } from "../../lib/serializers.js";

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await findProductById(req.params.id);
  if (product) {
    const updatedProduct = await updateProductAvailability(
      product.id,
      !product.isAvailable
    );
    res.status(200).json(serializeProduct(updatedProduct));
  } else {
    const message = "Product is unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default deleteProduct;
