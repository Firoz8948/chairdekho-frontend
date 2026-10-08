import Image from 'next/image';
import Link from 'next/link';
import styles from './pagehero.module.css';

const IMAGE_SIZES = '(max-width: 900px) 50vw, 380px';

export default function PageHeroBanner({ title, subtitle, backLabel, backHref }) {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroBg} aria-hidden="true" />
      <Image
        src="/images/hero/chairleft.webp"
        alt=""
        width={1254}
        height={1254}
        sizes={IMAGE_SIZES}
        className={`${styles.heroImg} ${styles.heroImgLeft}`}
      />
      <div className={styles.heroInner}>
        {backLabel && backHref && (
          <Link href={backHref} className={styles.backLink}>
            ← {backLabel}
          </Link>
        )}
        <div className={styles.accentLine} />
        <h1 className={styles.heroTitle}>{title}</h1>
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
      </div>
      <Image
        src="/images/hero/chairright.webp"
        alt=""
        width={1254}
        height={1254}
        sizes={IMAGE_SIZES}
        className={`${styles.heroImg} ${styles.heroImgRight}`}
      />
    </section>
  );
}
