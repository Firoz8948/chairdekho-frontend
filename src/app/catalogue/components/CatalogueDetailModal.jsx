'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MapPin, X } from 'lucide-react';
import { CONTACT } from '@/lib/seo';
import { productSlugApiPath } from '@/lib/productSlug';
import CatalogueWhatsAppLink from './CatalogueWhatsAppLink';
import { catalogueDisplayPrice, chairCode, formatCataloguePrice } from './catalogueUtils';
import styles from './catalogueModal.module.css';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CatalogueDetailModal({ product, onClose }) {
  const images = useMemo(
    () => (product?.images || []).map(resolveImageUrl).filter(Boolean),
    [product]
  );
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);

  useEffect(() => {
    setIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product, images.length, onClose]);

  const goNext = useCallback(() => {
    setIndex((i) => (images.length ? (i + 1) % images.length : 0));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
  }, [images.length]);

  if (!product) return null;

  const code = chairCode(product);
  const pdpHref = productSlugApiPath(product.slug);
  const priceLabel = formatCataloguePrice(catalogueDisplayPrice(product));

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className={styles.panel}>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.mediaCol}>
          <div
            className={styles.hero}
            onTouchStart={(e) => {
              touchStart.current = e.changedTouches[0]?.clientX;
            }}
            onTouchEnd={(e) => {
              const start = touchStart.current;
              const end = e.changedTouches[0]?.clientX;
              if (start == null || end == null) return;
              const delta = end - start;
              if (Math.abs(delta) < 40) return;
              if (delta < 0) goNext();
              else goPrev();
            }}
          >
            {images[index] ? (
              <img src={images[index]} alt="" className={styles.heroImage} draggable={false} />
            ) : (
              <div className={styles.heroImage} aria-hidden />
            )}
          </div>

          {images.length > 1 ? (
            <div className={styles.thumbs}>
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.meta}>
          <div className={styles.code}>{code}</div>

          <div className={styles.priceRow}>
            <div className={styles.price}>{priceLabel}</div>
            <CatalogueWhatsAppLink chairCode={code} />
          </div>

          <div className={styles.contactBlock}>
            <div>
              <a href={`tel:+${CONTACT.whatsapp}`}>{CONTACT.phone}</a>
            </div>
            <div>{CONTACT.address}</div>
          </div>

          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapBtn}
          >
            <MapPin size={16} aria-hidden />
            Open in Google Maps
          </a>

          <p className={styles.productTitle}>{product.name}</p>

          <Link href={pdpHref} className={styles.orderBtn}>
            Order online
          </Link>
        </div>
      </div>
    </div>
  );
}
