'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import CartItem from '@/components/CartItem/CartItem';
import { formatPrice } from '@/lib/utils';
import styles from './cart.module.css';

export default function CartPage() {
  const { items, subtotal, shipping, total, itemCount, clearCart, hydrated } = useCart();
  const toast = useToast();

  const handleClearCart = () => {
    clearCart();
    toast.info('Cart cleared');
  };

  if (!hydrated) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.subtitle}>
            {itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
          </p>
        </div>
      </div>

      <div className="container">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any products yet. Start shopping to fill it up!</p>
            <Link href="/products" className="btn btn-primary btn-lg" id="empty-cart-shop">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Cart Items */}
            <div className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <span className={styles.itemsCount}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                <button className="btn btn-danger btn-sm" onClick={handleClearCart} id="clear-cart-btn">
                  🗑 Clear Cart
                </button>
              </div>

              <div className={styles.itemsList}>
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div className={styles.continueShopping}>
                <Link href="/products" className="btn btn-ghost" id="continue-shopping">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryLine}>
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className={styles.summaryLine}>
                <span>Shipping</span>
                <span className={shipping === 0 ? styles.free : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>

              {shipping > 0 && (
                <div className={styles.shippingNote}>
                  Add {formatPrice(50 - subtotal)} more for free shipping
                </div>
              )}

              <div className={styles.divider} />

              <div className={styles.totalLine}>
                <span>Total</span>
                <span className={styles.totalAmount}>{formatPrice(total)}</span>
              </div>

              <Link href="/checkout" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} id="checkout-btn">
                Proceed to Checkout →
              </Link>

              <div className={styles.secureNote}>
                <span>🔒 Secure checkout — SSL encrypted</span>
              </div>

              {/* Promo */}
              <div className={styles.promoBlock}>
                <p className={styles.promoLabel}>Promo Code</p>
                <div className={styles.promoRow}>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter code..."
                    id="promo-input"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  />
                  <button className="btn btn-ghost btn-sm" id="apply-promo">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
