'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './products.module.css';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'Name A–Z' },
];

export default function ProductsClient({ products, categories, activeCategory, error }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0)); break;
      case 'name': result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return result;
  }, [products, search, sort, minPrice, maxPrice]);

  const handleCategory = (cat) => {
    router.push(cat ? `/products?category=${encodeURIComponent(cat)}` : '/products');
  };

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>
            {activeCategory ? (
              <span className={styles.catTitle}>
                <span className={styles.catBack} onClick={() => handleCategory('')}>All Products</span>
                <span style={{ color: 'var(--text-subtle)' }}> / </span>
                <span style={{ textTransform: 'capitalize' }}>{activeCategory}</span>
              </span>
            ) : 'All Products'}
          </h1>
          <p className={styles.subtitle}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterBlock}>
              <h3 className={styles.filterTitle}>Categories</h3>
              <button
                className={`${styles.catBtn} ${!activeCategory ? styles.catActive : ''}`}
                onClick={() => handleCategory('')}
                id="cat-all"
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.catBtn} ${activeCategory === cat ? styles.catActive : ''}`}
                  onClick={() => handleCategory(cat)}
                  id={`cat-filter-${cat.replace(/\s+/g, '-')}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.filterBlock}>
              <h3 className={styles.filterTitle}>Price Range</h3>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  className="input"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  min="0"
                  id="price-min"
                />
                <input
                  type="number"
                  className="input"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  min="0"
                  id="price-max"
                />
              </div>
            </div>

            <button
              className="btn btn-ghost w-full"
              onClick={() => { setSearch(''); setSort('default'); setMinPrice(''); setMaxPrice(''); handleCategory(''); }}
              id="clear-filters"
            >
              ✕ Clear Filters
            </button>
          </aside>

          {/* Main content */}
          <div className={styles.main}>
            {/* Search & Sort bar */}
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  id="product-search"
                />
              </div>
              <select
                className={`input ${styles.sortSelect}`}
                value={sort}
                onChange={e => setSort(e.target.value)}
                id="sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Error state */}
            {error && (
              <div className={styles.errorState}>
                <span>⚠️</span>
                <div>
                  <strong>Failed to load products</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Products grid */}
            {!error && filtered.length === 0 && (
              <div className="empty-state">
                <span className="empty-state-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button className="btn btn-primary" onClick={() => { setSearch(''); setMinPrice(''); setMaxPrice(''); }}>
                  Clear Search
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="products-grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
