'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import { formatPrice, calcDiscount, renderStars, truncate } from '@/lib/utils';
import styles from './product-detail.module.css';

export default function ProductDetailClient({ product, relatedProducts }) {
  const { addToCart, isInCart, getQuantity, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const cartQty = getQuantity(product.id);
  const originalPrice = calcDiscount(product.price);
  const discountPct = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`Added ${qty}x "${truncate(product.title, 25)}" to cart!`);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡');
  };

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav className={styles.breadNav} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadLink}>Home</Link>
            <span>›</span>
            <Link href="/products" className={styles.breadLink}>Products</Link>
            <span>›</span>
            <Link href={`/products?category=${product.category}`} className={styles.breadLink} style={{ textTransform: 'capitalize' }}>
              {product.category}
            </Link>
            <span>›</span>
            <span className={styles.breadCurrent}>{truncate(product.title, 40)}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            {/* Image panel */}
            <div className={styles.imagePanel}>
              <div className={styles.mainImage}>
                {!imgError ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'contain', padding: '32px' }}
                    onError={() => setImgError(true)}
                    priority
                  />
                ) : (
                  <div className={styles.imgFallback}>🖼️</div>
                )}
                {discountPct > 0 && (
                  <span className={styles.discountBadge}>-{discountPct}%</span>
                )}
              </div>
            </div>

            {/* Info panel */}
            <div className={styles.infoPanel}>
              <span className={`badge badge-primary ${styles.category}`}>{product.category}</span>
              <h1 className={styles.productTitle}>{product.title}</h1>

              {/* Rating */}
              <div className={styles.ratingRow}>
                <span className="stars" style={{ fontSize: '1.1rem' }}>
                  {renderStars(product.rating?.rate || 4)}
                </span>
                <span className={styles.ratingNum}>{product.rating?.rate || '4.0'}</span>
                <span className={styles.ratingCount}>({product.rating?.count || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className={styles.priceBlock}>
                <span className="price" style={{ fontSize: '2rem' }}>{formatPrice(product.price)}</span>
                <span className="price-original" style={{ fontSize: '1.1rem' }}>{formatPrice(originalPrice)}</span>
                <span className={styles.saveBadge}>Save {discountPct}%</span>
              </div>

              {/* Short description */}
              <p className={styles.shortDesc}>{truncate(product.description, 160)}</p>

              <div className="divider" />

              {/* Quantity selector */}
              <div className={styles.qtyRow}>
                <span className="label" style={{ marginBottom: 0 }}>Quantity:</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} id="qty-dec">−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => q + 1)} id="qty-inc">+</button>
                </div>
                {inCart && (
                  <span className={styles.cartInfo}>Already in cart: {cartQty}</span>
                )}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleAddToCart}
                  id="add-to-cart-btn"
                >
                  🛒 {inCart ? 'Add More to Cart' : 'Add to Cart'}
                </button>
                <button
                  className={`btn btn-lg ${wishlisted ? 'btn-danger' : 'btn-ghost'}`}
                  onClick={handleWishlist}
                  id="wishlist-btn"
                >
                  {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
                </button>
              </div>

              {inCart && (
                <Link href="/cart" className="btn btn-outline w-full" style={{ justifyContent: 'center' }} id="go-to-cart">
                  View Cart ({cartQty} item{cartQty !== 1 ? 's' : ''}) →
                </Link>
              )}

              <div className="divider" />

              {/* Trust badges */}
              <div className={styles.trustBadges}>
                {['🔒 Secure Checkout', '🚚 Free Shipping $50+', '♻️ 30-day Returns'].map(b => (
                  <span key={b} className={styles.trustItem}>{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <div className={styles.tabList} role="tablist">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  id={`tab-${tab}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className={styles.tabContent} role="tabpanel">
              {activeTab === 'description' && (
                <p className={styles.description}>{product.description}</p>
              )}
              {activeTab === 'specifications' && (
                <table className={styles.specTable}>
                  <tbody>
                    <tr><td>Category</td><td style={{ textTransform: 'capitalize' }}>{product.category}</td></tr>
                    <tr><td>Price</td><td>{formatPrice(product.price)}</td></tr>
                    <tr><td>Rating</td><td>{product.rating?.rate || 'N/A'} / 5</td></tr>
                    <tr><td>Reviews</td><td>{product.rating?.count || 0}</td></tr>
                    <tr><td>ID</td><td>#{product.id}</td></tr>
                  </tbody>
                </table>
              )}
              {activeTab === 'reviews' && (
                <div className={styles.reviews}>
                  <div className={styles.reviewSummary}>
                    <span className={styles.reviewScore}>{product.rating?.rate || '4.0'}</span>
                    <div>
                      <span className="stars" style={{ fontSize: '1.5rem' }}>{renderStars(product.rating?.rate || 4)}</span>
                      <p className="text-muted text-sm">{product.rating?.count || 0} total reviews</p>
                    </div>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Customer reviews are aggregated from verified purchases.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className={styles.related}>
              <div className={styles.relatedHeader}>
                <h2 className="section-title">Related Products</h2>
                <Link href={`/products?category=${product.category}`} className="btn btn-outline">
                  See All
                </Link>
              </div>
              <div className="products-grid">
                {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
