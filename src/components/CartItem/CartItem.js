'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, truncate } from '@/lib/utils';
import styles from './CartItem.module.css';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);

  const handleRemove = () => {
    removeFromCart(item.id);
    toast.info(`"${truncate(item.title, 25)}" removed from cart`);
  };

  return (
    <div className={styles.item} id={`cart-item-${item.id}`}>
      {/* Image */}
      <Link href={`/products/${item.id}`} className={styles.imgWrap}>
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="80px"
            style={{ objectFit: 'contain', padding: '8px' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: '2rem', opacity: 0.4 }}>🖼️</span>
        )}
      </Link>

      {/* Info */}
      <div className={styles.info}>
        <Link href={`/products/${item.id}`} className={styles.title}>
          {truncate(item.title, 60)}
        </Link>
        <span className={`badge badge-primary ${styles.cat}`}>{item.category}</span>
        <span className={styles.unitPrice}>{formatPrice(item.price)} each</span>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className="qty-control">
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            id={`qty-dec-${item.id}`}
            aria-label="Decrease quantity"
          >−</button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            id={`qty-inc-${item.id}`}
            aria-label="Increase quantity"
          >+</button>
        </div>
        <span className={styles.subtotal}>{formatPrice(item.price * item.quantity)}</span>
        <button
          className={`btn btn-danger btn-sm ${styles.removeBtn}`}
          onClick={handleRemove}
          id={`remove-${item.id}`}
          aria-label="Remove from cart"
        >
          ✕ Remove
        </button>
      </div>
    </div>
  );
}
