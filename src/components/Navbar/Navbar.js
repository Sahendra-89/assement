'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/wishlist', label: 'Wishlist' },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} id="main-nav">
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="nav-logo">
          <span className={styles.logoIcon}>⚡</span>
          <span>LuxeShop</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={styles.link}>{l.label}</Link>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/wishlist" className={styles.iconBtn} id="nav-wishlist" aria-label="Wishlist">
            <span>♡</span>
            {wishCount > 0 && <span className={styles.badge}>{wishCount}</span>}
          </Link>
          <Link href="/cart" className={styles.iconBtn} id="nav-cart" aria-label="Cart">
            <span>🛒</span>
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>
          <Link href="/checkout" className="btn btn-primary btn-sm" id="nav-checkout">
            Checkout
          </Link>
          {/* Mobile toggle */}
          <button
            className={`${styles.menuToggle} btn btn-ghost btn-icon`}
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
            id="nav-menu-toggle"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className={styles.mobileSep} />
          <Link href="/cart" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          <Link href="/checkout" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            Checkout
          </Link>
        </div>
      )}
    </nav>
  );
}
