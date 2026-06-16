import { IProduct } from '@/types';

type Props = {
  product: IProduct;
};

const ProductCarouselItem = ({ product }: Props) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-fit items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8">
        <img
          className="h-44 w-44 object-contain object-center transition-transform duration-300 hover:scale-105"
          src={product.image}
          alt={product.name}
        />
      </div>
      <p className="max-w-md text-center font-display text-2xl font-semibold capitalize text-slate-100">
        {product.name}
      </p>
      <span className="-mt-2 font-display text-3xl font-bold text-brand-400">
        ₹{product.price.toLocaleString('en-IN')}
      </span>
    </div>
  );
};

export default ProductCarouselItem;
