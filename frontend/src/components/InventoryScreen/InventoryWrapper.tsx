import { deleteProduct, getProducts } from "@/api/products";
import InventoryPagination from "@/components/InventoryScreen/InventoryPagination";
import ProductRowItem from "@/components/UI/ProductRowItem";
import { getErrorMessage } from "@/config";
import { IProduct } from "@/types";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const InventoryWrapper = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { isLoading, error, data } = useQuery({
    queryKey: [`inventory-${page}-products`],
    queryFn: () => getProducts(page),
    onError: (queryError) => {
      toast.error(getErrorMessage(queryError, "Error occurred while fetching inventory details!"));
    },
  });

  const { mutate: toggleProductAvailability, isLoading: productAvailabilityLoading } =
    useMutation({
      mutationFn: (productId: string) => deleteProduct(productId),
      onError: (mutationError) => {
        toast.error(
          getErrorMessage(mutationError, "Error occurred while updating product availability!")
        );
        setSelectedProductId(null);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`inventory-${page}-products`] });
        toast.success("Product availability updated");
        setSelectedProductId(null);
      },
    });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
        Could not load inventory.
      </p>
    );
  }

  const deleteSingleItem = (product: IProduct) => {
    setSelectedProductId(product._id);
    toggleProductAvailability(product._id);
  };

  const navigateToProductPage = (product: IProduct) => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-slate-100">Inventory</h1>
        <p className="mt-2 text-slate-400">Manage storefront availability and stock levels.</p>
      </div>

      {data.products.map((product) => (
        <ProductRowItem
          key={product._id}
          product={product}
          deleteSingleItem={deleteSingleItem}
          redirectToProduct={navigateToProductPage}
          shouldAddRoundedBorders
          showProductStock
          isProductActionOngoing={
            selectedProductId === product._id && productAvailabilityLoading
          }
        />
      ))}

      <InventoryPagination
        currentPage={page}
        totalPage={data.pages}
        fetchInventoryByPage={setPage}
      />
    </div>
  );
};

export default InventoryWrapper;
