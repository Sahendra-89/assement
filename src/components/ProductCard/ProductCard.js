'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, truncate, calcDiscount, renderStars } from '@/lib/utils';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const originalPrice = calcDiscount(product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`"${truncate(product.title, 30)}" added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.info(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡');
  };

  return (
    <Link href={`/products/${product.id}`} className={`card ${styles.card}`} id={`product-card-${product.id}`}>
      {/* Wishlist Button */}
      <button
        className={`${styles.wishBtn} ${wishlisted ? styles.wishlisted : ''}`}
        onClick={handleWishlist}
        aria-label="Toggle wishlist"
        id={`wishlist-btn-${product.id}`}
      >
        {wishlisted ? '♥' : '♡'}
      </button>

      {/* Image container */}
      <div className={styles.imgWrap}>
        {!imgError ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.img}
            onError={() => setImgError(true)}
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <div className={styles.imgFallback}>🖼️</div>
        )}
        {/* Category badge */}
        <span className={`badge badge-primary ${styles.catBadge}`}>
          {truncate(product.category, 16)}
        </span>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.stars}>
          <span className="stars">{renderStars(product.rating?.rate || 4)}</span>
          <span className={styles.ratingCount}>({product.rating?.count || 0})</span>
        </div>

        <h3 className={styles.title}>{truncate(product.title, 52)}</h3>

        <div className={styles.priceRow}>
          <span className="price">{formatPrice(product.price)}</span>
          <span className="price-original">{formatPrice(originalPrice)}</span>
        </div>

        <button
          className={`btn btn-primary w-full ${styles.cartBtn} ${inCart ? styles.inCart : ''}`}
          onClick={handleAddToCart}
          id={`add-to-cart-${product.id}`}
        >
          {inCart ? '✓ In Cart' : '+ Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
