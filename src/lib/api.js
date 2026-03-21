const BASE_URL = 'https://fakestoreapi.com';

async function fetcher(path) {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getProducts() {
  return fetcher('/products');
}

export async function getProduct(id) {
  return fetcher(`/products/${id}`);
}

export async function getCategories() {
  return fetcher('/products/categories');
}

export async function getProductsByCategory(category) {
  return fetcher(`/products/category/${encodeURIComponent(category)}`);
}
