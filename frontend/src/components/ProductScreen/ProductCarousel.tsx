import ProductCarouselItem from '@/components/ProductScreen/ProductCarouselItem';
import { IProduct } from '@/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type ProductCarouselProps = {
  products: IProduct[];
};

const ProductCarousel = (props: ProductCarouselProps) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (props.products.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % props.products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [props.products]);

  const product = useMemo(() => {
    return props.products.find((_productItem, ind) => ind === index);
  }, [props.products, index]);

  const changeToPrevious = () => {
    setIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      if (newIndex < 0) newIndex = props.products.length - 1;
      return newIndex;
    });
  };

  const changeToNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % props.products.length);
  };

  if (!product) return null;

  return (
    <div className="relative flex w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 py-12 text-center">
      <ArrowLeftIcon
        onClick={changeToPrevious}
        className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors hover:text-brand-400"
      />
      <Link to={`/products/${product._id}`}>
        <ProductCarouselItem product={product} />
      </Link>
      <ArrowRightIcon
        onClick={changeToNext}
        className="absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors hover:text-brand-400"
      />
    </div>
  );
};

export default ProductCarousel;
