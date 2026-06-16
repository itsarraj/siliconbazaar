import { addProduct } from "@/api/products";
import Button from "@/components/UI/Button";
import { getErrorMessage } from "@/config";
import { cardClass, inputClass } from "@/lib/ui";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    qtyInStock: "",
    image: undefined as File | undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setProductData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setPreviewImage(reader.result as string);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addProduct({
        ...productData,
        price: parseFloat(productData.price),
        qtyInStock: parseInt(productData.qtyInStock, 10),
      });
      toast.success("Product added successfully");
      setProductData({ name: "", price: "", qtyInStock: "", image: undefined });
      setPreviewImage("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Error occurred while adding the product!"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 font-display text-3xl font-bold text-slate-100">Add product</h1>
      <p className="mb-8 text-slate-400">Create a new listing in the storefront inventory.</p>

      <form onSubmit={handleSubmit} className={`${cardClass} flex flex-col gap-6 p-8`}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-slate-300">
            Product name
          </label>
          <input
            required
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            id="name"
            type="text"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-sm text-slate-300">
            Price (INR)
          </label>
          <input
            required
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            id="price"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="qtyInStock" className="text-sm text-slate-300">
            Quantity in stock
          </label>
          <input
            required
            type="number"
            id="qtyInStock"
            name="qtyInStock"
            value={productData.qtyInStock}
            onChange={handleInputChange}
            min="0"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-sm text-slate-300">
            Product image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
            className={inputClass}
          />
        </div>
        {previewImage && (
          <img src={previewImage} alt="Preview" className="h-40 w-40 rounded-lg object-cover" />
        )}
        <Button type="submit" variant="brand" loading={isSubmitting}>
          Add to inventory
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
