'use client';
import { CartProvider } from '@/context/CartContext';

import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';

export default function Providers({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
