import Link from 'next/link';
import { Armchair, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './notFound.module.css';

export default function StorefrontNotFound({
  code = '404',
  title = 'Page not found',
  description = "We couldn't find the page you're looking for. Head to our shop to explore chairs and tables.",
  primaryHref = '/shop',
  primaryLabel = 'Go to shop',
  secondaryHref = '/',
  secondaryLabel = 'Back to home',
}) {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main} id="main-content">
        <div className={styles.card} role="status" aria-live="polite">
          <div className={styles.iconWrap} aria-hidden="true">
            <Armchair size={28} strokeWidth={1.75} />
          </div>
          <span className={styles.code}>{code}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.actions}>
            <Link href={primaryHref} className={styles.primaryBtn}>
              <ShoppingBag size={18} strokeWidth={2} aria-hidden="true" />
              {primaryLabel}
            </Link>
            {secondaryHref ? (
              <Link href={secondaryHref} className={styles.secondaryBtn}>
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
