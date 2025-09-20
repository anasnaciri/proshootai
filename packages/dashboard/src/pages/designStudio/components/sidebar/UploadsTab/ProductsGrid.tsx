import { Product } from '@/pages/designStudio/types';
import useProducts from '../../../hooks/useProducts';
import ProductImage from './ProductImage';

const ProductsGrid = () => {
  const { isPending, isError, data, error } = useProducts();

  //   const images = [
  //     'https://images.unsplash.com/photo-1651302974008-fb6112faf32c?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //   ];

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  console.log(data.result);

  return (
    <div className="grid grid-cols-3 gap-2 ">
      {data?.result?.map((product: Product, index: number) => (
        <ProductImage product={product} key={index} />
      ))}
    </div>
  );
};

export default ProductsGrid;
