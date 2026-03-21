import { getProduct, getProducts } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    return {
      title: `${product.title} — LuxeShop`,
      description: product.description,
    };
  } catch {
    return { title: 'Product — LuxeShop' };
  }
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map(p => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  let product = null;
  let relatedProducts = [];
  let error = null;

  try {
    const all = await getProducts();
    product = all.find(p => p.id === parseInt(id));
    if (!product) notFound();
    relatedProducts = all
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  } catch (e) {
    error = e.message;
  }

  if (!product && error) {
    return (
      <div className="container section">
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <h1 style={{ marginBottom: '16px' }}>Failed to Load Product</h1>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

