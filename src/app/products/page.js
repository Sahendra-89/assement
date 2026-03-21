import { getProducts, getCategories, getProductsByCategory } from '@/lib/api';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'All Products — LuxeShop',
  description: 'Browse our full collection of premium products. Filter by category and find the perfect item.',
};

export default async function ProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category || '';

  let products = [];
  let categories = [];
  let error = null;

  try {
    [products, categories] = await Promise.all([
      category ? getProductsByCategory(category) : getProducts(),
      getCategories(),
    ]);
  } catch (e) {
    error = e.message;
  }

  return (
    <ProductsClient
      products={products}
      categories={categories}
      activeCategory={category}
      error={error}
    />
  );
}

