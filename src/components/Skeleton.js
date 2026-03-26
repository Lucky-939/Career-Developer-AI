import styles from './Skeleton.module.css';

export function Skeleton({ width, height, borderRadius, style }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width: width || '100%', height: height || '20px', borderRadius: borderRadius || 'var(--radius-md)', ...style }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <Skeleton height="40px" width="40px" borderRadius="var(--radius-sm)" />
      <div className={styles.cardLines}>
        <Skeleton width="60%" height="16px" />
        <Skeleton width="80%" height="12px" />
      </div>
    </div>
  );
}

export function PageSkeleton({ rows = 3 }) {
  return (
    <div className={styles.pageSkeleton}>
      <Skeleton width="40%" height="32px" />
      <Skeleton width="70%" height="16px" />
      <div className={styles.grid}>
        {Array.from({ length: rows }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
