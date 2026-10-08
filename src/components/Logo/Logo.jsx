import Image from 'next/image';
import Link from 'next/link';
import styles from './logo.module.css';

export default function Logo({ size = 'md', className = '', onClick }) {
  return (
    <Link
      href="/"
      className={`${styles.logo} ${styles[size] || ''} ${className}`.trim()}
      aria-label="ChairDekho Home"
      onClick={onClick}
    >
      <Image
        src="/images/brand/chakladekho.svg"
        alt="ChairDekho"
        width={1355}
        height={842}
        unoptimized
        className={styles.image}
      />
    </Link>
  );
}
