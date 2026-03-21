import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export const metadata = {
  title: 'LuxeShop — Premium E-Commerce Store',
  description: 'Discover our curated selection of premium products. Electronics, fashion, jewelry and more.',
};

export default async function HomePage() {
  let products = [];
  let categories = [];
  let error = null;

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch (e) {
    error = e.message;
  }

  const featured = products.slice(0, 4);
  const newArrivals = products.slice(14, 20);

  const categoryIcons = {
    "electronics": "💻",
    "jewelery": "💎",
    "men's clothing": "👔",
    "women's clothing": "👗",
  };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroContent}`}>
          <span className={`badge badge-primary ${styles.heroBadge}`}>✦ New Season Drops</span>
          <h1 className={styles.heroTitle}>
            Shop the World's<br />
            <span className={styles.heroGradient}>Best Products</span>
          </h1>
          <p className={styles.heroSub}>
            Discover thousands of curated premium products — from cutting-edge electronics to timeless fashion.
            Free shipping on orders over $50.
          </p>
          <div className={styles.heroCta}>
            <Link href="/products" className="btn btn-primary btn-lg" id="hero-shop-now">
              Shop Now →
            </Link>
            <Link href="/wishlist" className="btn btn-ghost btn-lg" id="hero-wishlist">
              My Wishlist ♡
            </Link>
          </div>
          <div className={styles.heroStats}>
            {[
              { value: '20K+', label: 'Products' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Find exactly what you're looking for</p>
            <div className={styles.catGrid}>
              {categories.map(cat => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className={styles.catCard}
                  id={`cat-${cat.replace(/\s+/g, '-')}`}
                >
                  <span className={styles.catIcon}>{categoryIcons[cat] || '🏷️'}</span>
                  <span className={styles.catName}>{cat}</span>
                  <span className={styles.catArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <section className="section">
          <div className="container">
            <div className={styles.errorBox}>
              <span>⚠️</span>
              <div>
                <strong>Could not load products</strong>
                <p>{error}</p>
              </div>
              <Link href="/products" className="btn btn-primary">Retry</Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className="section-title">Featured Products</h2>
                <p className="section-sub">Hand-picked just for you</p>
              </div>
              <Link href="/products" className="btn btn-outline" id="see-all-featured">View All</Link>
            </div>
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className={styles.promoBanner}>
        <div className="container">
          <div className={styles.promoInner}>
            <div>
              <h2 className={styles.promoTitle}>🚚 Free Shipping on Orders $50+</h2>
              <p className={styles.promoSub}>Plus easy 30-day returns. Shop risk-free today.</p>
            </div>
            <Link href="/products" className="btn btn-primary btn-lg" id="promo-shop">Start Shopping</Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className={styles.sectionHeader}>
              <div>
                <h2 className="section-title">New Arrivals</h2>
                <p className="section-sub">Fresh products added this week</p>
              </div>
              <Link href="/products" className="btn btn-outline" id="see-all-new">View All</Link>
            </div>
            <div className="products-grid">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className={styles.featuresGrid}>
            {[
              { icon: '🚀', title: 'Fast Shipping', desc: 'Express delivery to your door in 2-5 business days.' },
              { icon: '🔒', title: 'Secure Payments', desc: 'Your payment info is always protected and encrypted.' },
              { icon: '♻️', title: 'Easy Returns', desc: '30-day hassle-free returns with full refunds.' },
              { icon: '💬', title: '24/7 Support', desc: 'Our team is always here to help you, any time.' },
            ].map(f => (
              <div key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
