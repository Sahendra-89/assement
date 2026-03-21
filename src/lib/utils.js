export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

export function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export function calcDiscount(price) {
  // Simulate a "original" price 10-30% higher
  const pct = 10 + Math.floor((price * 13) % 21);
  return parseFloat((price * (1 + pct / 100)).toFixed(2));
}

export function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}
