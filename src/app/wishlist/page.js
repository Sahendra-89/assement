'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, truncate, renderStars } from '@/lib/utils';
import styles from './wishlist.module.css';

function WishlistItem({ item }) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);

  const inCart = isInCart(item.id);

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`"${truncate(item.title, 25)}" added to cart!`);
  };

  const handleRemove = () => {
    removeFromWishlist(item.id);
    toast.info('Removed from wishlist');
  };

  return (
    <div className={styles.item} id={`wishlist-item-${item.id}`}>
      <Link href={`/products/${item.id}`} className={styles.imgWrap}>
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="120px"
            style={{ objectFit: 'contain', padding: '12px' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>🖼️</span>
        )}
      </Link>

      <div className={styles.info}>
        <span className={`badge badge-primary`} style={{ alignSelf: 'flex-start' }}>{item.category}</span>
        <Link href={`/products/${item.id}`} className={styles.title}>{item.title}</Link>
        <div className={styles.meta}>
          <span className="stars">{renderStars(item.rating?.rate || 4)}</span>
          <span className="text-muted text-sm">({item.rating?.count || 0})</span>
        </div>
        <span className="price">{formatPrice(item.price)}</span>
      </div>

      <div className={styles.actions}>
        <button
          className={`btn btn-primary ${inCart ? styles.inCart : ''}`}
          onClick={handleAddToCart}
          id={`wishlist-add-cart-${item.id}`}
        >
          {inCart ? '✓ In Cart' : '+ Add to Cart'}
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleRemove}
          id={`wishlist-remove-${item.id}`}
        >
          ✕ Remove
        </button>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items, hydrated } = useWishlist();
  const { addToCart } = useCart();
  const toast = useToast();

  const addAllToCart = () => {
    items.forEach(item => addToCart(item));
    toast.success(`Added ${items.length} item${items.length !== 1 ? 's' : ''} to cart!`);
  };

  if (!hydrated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>My Wishlist</h1>
              <p className={styles.subtitle}>
                {items.length > 0 ? `${items.length} saved item${items.length !== 1 ? 's' : ''}` : 'No items saved yet'}
              </p>
            </div>
            {items.length > 0 && (
              <button className="btn btn-primary" onClick={addAllToCart} id="add-all-to-cart">
                🛒 Add All to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Save your favorite products here to buy them later or share with friends.</p>
            <Link href="/products" className="btn btn-primary btn-lg" id="empty-wishlist-shop">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(item => (
              <WishlistItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
