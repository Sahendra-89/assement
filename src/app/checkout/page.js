'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, truncate } from '@/lib/utils';
import styles from './checkout.module.css';

const FIELDS = [
  { id: 'firstName', label: 'First Name', placeholder: 'John', type: 'text', half: true },
  { id: 'lastName', label: 'Last Name', placeholder: 'Doe', type: 'text', half: true },
  { id: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email', half: false },
  { id: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel', half: true },
  { id: 'address', label: 'Street Address', placeholder: '123 Main Street', type: 'text', half: false },
  { id: 'city', label: 'City', placeholder: 'New York', type: 'text', half: true },
  { id: 'state', label: 'State / Province', placeholder: 'NY', type: 'text', half: true },
  { id: 'zip', label: 'ZIP / Postal Code', placeholder: '10001', type: 'text', half: true },
  { id: 'country', label: 'Country', placeholder: 'United States', type: 'text', half: true },
];

const VALIDATORS = {
  firstName: v => !v.trim() ? 'First name is required' : '',
  lastName: v => !v.trim() ? 'Last name is required' : '',
  email: v => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email' : '',
  phone: v => !v.trim() ? 'Phone is required' : '',
  address: v => !v.trim() ? 'Address is required' : '',
  city: v => !v.trim() ? 'City is required' : '',
  state: v => !v.trim() ? 'State is required' : '',
  zip: v => !v.trim() ? 'ZIP code is required' : '',
  country: v => !v.trim() ? 'Country is required' : '',
};

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, itemCount, clearCart, hydrated } = useCart();
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState(
    Object.fromEntries(FIELDS.map(f => [f.id, '']))
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payMethod, setPayMethod] = useState('card');

  const handleChange = (id, value) => {
    setForm(f => ({ ...f, [id]: value }));
    if (errors[id]) setErrors(e => ({ ...e, [id]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(VALIDATORS).forEach(([id, fn]) => {
      const err = fn(form[id] || '');
      if (err) newErrors[id] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the errors below');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
    clearCart();
  };

  if (!hydrated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-enter">
        <div className="container">
          <div className={styles.successState}>
            <div className={styles.successIcon}>✅</div>
            <h1 className={styles.successTitle}>Order Placed!</h1>
            <p className={styles.successSub}>
              Thank you, <strong>{form.firstName} {form.lastName}</strong>! Your order has been confirmed.
              A confirmation will be sent to <strong>{form.email}</strong>.
            </p>
            <div className={styles.successActions}>
              <Link href="/products" className="btn btn-primary btn-lg" id="success-continue">
                Continue Shopping
              </Link>
              <Link href="/" className="btn btn-ghost btn-lg" id="success-home">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>Complete your order below</p>
        </div>
      </div>

      <div className="container">
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products before checking out.</p>
            <Link href="/products" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.layout} noValidate>
            {/* Left: Form */}
            <div className={styles.formSection}>

              {/* Contact Info */}
              <div className={styles.formBlock}>
                <h2 className={styles.blockTitle}>📋 Contact Information</h2>
                <div className={styles.formGrid}>
                  {FIELDS.slice(0, 3).map(f => (
                    <div key={f.id} className={`${styles.fieldWrap} ${f.half ? styles.half : styles.full}`}>
                      <label className="label" htmlFor={f.id}>{f.label}</label>
                      <input
                        id={f.id}
                        name={f.id}
                        type={f.type}
                        className={`input ${errors[f.id] ? 'error' : ''}`}
                        placeholder={f.placeholder}
                        value={form[f.id]}
                        onChange={e => handleChange(f.id, e.target.value)}
                        autoComplete={f.id}
                      />
                      {errors[f.id] && <span className="field-error">{errors[f.id]}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className={styles.formBlock}>
                <h2 className={styles.blockTitle}>🏠 Shipping Address</h2>
                <div className={styles.formGrid}>
                  {FIELDS.slice(3).map(f => (
                    <div key={f.id} className={`${styles.fieldWrap} ${f.half ? styles.half : styles.full}`}>
                      <label className="label" htmlFor={f.id}>{f.label}</label>
                      <input
                        id={f.id}
                        name={f.id}
                        type={f.type}
                        className={`input ${errors[f.id] ? 'error' : ''}`}
                        placeholder={f.placeholder}
                        value={form[f.id]}
                        onChange={e => handleChange(f.id, e.target.value)}
                        autoComplete={f.id}
                      />
                      {errors[f.id] && <span className="field-error">{errors[f.id]}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className={styles.formBlock}>
                <h2 className={styles.blockTitle}>💳 Payment Method</h2>
                <div className={styles.payOptions}>
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { id: 'crypto', label: 'Crypto', icon: '₿' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${styles.payOption} ${payMethod === opt.id ? styles.payActive : ''}`}
                      onClick={() => setPayMethod(opt.id)}
                      id={`pay-${opt.id}`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {payMethod === 'card' && (
                  <div className={styles.cardFields}>
                    <div className={styles.fieldWrap} style={{ gridColumn: '1/-1' }}>
                      <label className="label">Card Number</label>
                      <input className="input" type="text" placeholder="1234 5678 9012 3456" id="card-number" />
                    </div>
                    <div className={styles.formGrid} style={{ gridColumn: '1/-1' }}>
                      <div className={styles.fieldWrap + ' ' + styles.half}>
                        <label className="label">Expiry</label>
                        <input className="input" type="text" placeholder="MM/YY" id="card-expiry" />
                      </div>
                      <div className={styles.fieldWrap + ' ' + styles.half}>
                        <label className="label">CVV</label>
                        <input className="input" type="text" placeholder="123" id="card-cvv" />
                      </div>
                    </div>
                  </div>
                )}

                {payMethod !== 'card' && (
                  <div className={styles.payRedirect}>
                    <span>You will be redirected to complete payment with {payMethod}.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className={styles.sidebar}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.orderItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.orderImgWrap}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="52px"
                        style={{ objectFit: 'contain', padding: '6px' }}
                      />
                      <span className={styles.qtyBadge}>{item.quantity}</span>
                    </div>
                    <span className={styles.orderItemTitle}>{truncate(item.title, 36)}</span>
                    <span className={styles.orderItemPrice}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Tax (est.)</span>
                  <span>{formatPrice(subtotal * 0.08)}</span>
                </div>
              </div>

              <div className="divider" />

              <div className={styles.totalLine}>
                <span>Total</span>
                <span className={styles.totalAmount}>{formatPrice(total + subtotal * 0.08)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                style={{ justifyContent: 'center' }}
                disabled={submitting}
                id="place-order-btn"
              >
                {submitting ? (
                  <>
                    <span className={styles.btnSpinner} />
                    Processing…
                  </>
                ) : (
                  '🎉 Place Order'
                )}
              </button>

              <p className={styles.secureNote}>🔒 Your payment info is secure and encrypted</p>

              <Link href="/cart" className={styles.backToCart} id="back-to-cart">
                ← Back to Cart
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
