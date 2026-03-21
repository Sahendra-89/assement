import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>⚡ LuxeShop</Link>
          <p className={styles.tagline}>Premium products, delivered to your door. Shop the world's best brands at unbeatable prices.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Shop</h4>
            <Link href="/products">All Products</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart</Link>
          </div>
          <div className={styles.col}>
            <h4>Account</h4>
            <Link href="/checkout">Checkout</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} LuxeShop. All rights reserved.</span>
        <span className={styles.made}>Built with Next.js ⚡</span>
      </div>
    </footer>
  );
}
