import { IProduct } from '@/types';
import { Link } from 'react-router-dom';

type Props = {
  product: IProduct;
};

const ProductListItem = ({ product }: Props) => {
  return (
    <div className="group circuit-card overflow-hidden md:flex">
      <div className="flex h-60 w-full flex-shrink-0 items-center justify-center bg-slate-800/50 p-6 md:w-60">
        <img
          className="h-48 w-48 object-contain object-center transition-transform duration-300 group-hover:scale-110"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="line-clamp-2 font-display text-xl font-semibold text-slate-100 transition-colors group-hover:text-brand-400">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 line-through">
          ₹{(product.price * 1.2).toLocaleString('en-IN')}
        </p>
        <p className="font-display text-3xl font-bold text-brand-400">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-slate-500">
          {product.qtyInStock > 0 ? `${product.qtyInStock} in stock` : 'Out of stock'}
        </p>
      </div>
    </div>
  );
};

export default ProductListItem;
