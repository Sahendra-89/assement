import styles from './ProductSkeleton.module.css';

export default function ProductSkeleton() {
  return (
    <div className={`card ${styles.card}`}>
      <div className={`skeleton ${styles.img}`} />
      <div className={styles.content}>
        <div className={`skeleton ${styles.line} ${styles.short}`} />
        <div className={`skeleton ${styles.line} ${styles.full}`} />
        <div className={`skeleton ${styles.line} ${styles.med}`} />
        <div className={`skeleton ${styles.line} ${styles.price}`} />
        <div className={`skeleton ${styles.btn}`} />
      </div>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
