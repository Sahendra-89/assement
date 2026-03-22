const BASE_URL = 'https://dummyjson.com';

async function fetcher(path) {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/**
 * Normalize a dummyjson product to match the shape the UI expects:
 *   product.image  (was product.thumbnail in dummyjson)
 *   product.rating.rate  (was product.rating number in dummyjson)
 *   product.rating.count (estimated from reviews array length)
 */
function normalize(product) {
  return {
    ...product,
    image: product.thumbnail,
    rating: {
      rate: product.rating ?? 0,
      count: product.reviews?.length ?? 0,
    },
  };
}

export async function getProducts() {
  const data = await fetcher('/products?limit=100');
  return data.products.map(normalize);
}

export async function getProduct(id) {
  const product = await fetcher(`/products/${id}`);
  return normalize(product);
}

export async function getCategories() {
  const data = await fetcher('/products/categories');
  // dummyjson returns array of objects: [{ slug, name, url }]
  return data.map((cat) => cat.slug);
}

export async function getProductsByCategory(category) {
  const data = await fetcher(`/products/category/${encodeURIComponent(category)}?limit=100`);
  return data.products.map(normalize);
}
