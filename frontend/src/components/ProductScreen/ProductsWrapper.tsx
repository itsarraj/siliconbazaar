import HeroSection from '@/components/Home/HeroSection';
import { getProducts } from '@/api/products';
import ProductCarousel from '@/components/ProductScreen/ProductCarousel';
import ProductListView from '@/components/ProductScreen/ProductListView';
import ProductPagination from '@/components/ProductScreen/ProductPagination';
import { getErrorMessage } from '@/config';
import { selectPage, selectPages, selectProducts, setPage, setProducts } from '@/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const ProductsWrapper = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageNumberFromQuery = queryParams.get('page');
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const page = useAppSelector(selectPage);
  const pages = useAppSelector(selectPages);

  useEffect(() => {
    if (pageNumberFromQuery) {
      dispatch(
        setPage({
          page: Number(pageNumberFromQuery),
        })
      );
    }
  }, [pageNumberFromQuery, dispatch]);

  const { isLoading, error } = useQuery({
    queryKey: [`${page}-products`],
    queryFn: async () => {
      return await getProducts(page);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching products!');
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      dispatch(
        setProducts({
          products: data.products,
          page: data.page,
          pages: data.pages,
        })
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-400">Error occurred while fetching products!</p>;

  return (
    <div className="flex flex-col gap-12">
      <HeroSection />
      <div id="products">
        <h2 className="font-display text-2xl font-bold text-slate-100 mb-6">
          Featured <span className="text-brand-400">components</span>
        </h2>
        <ProductCarousel products={products} />
      </div>
      <ProductListView products={products} />
      <ProductPagination currentPage={page} totalPage={pages} />
    </div>
  );
};

export default ProductsWrapper;
