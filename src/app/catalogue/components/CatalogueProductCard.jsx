'use client';

import ColorSwatches, { buildColorSwatchItems } from '@/components/ColorSwatches/ColorSwatches';
import CatalogueWhatsAppLink from './CatalogueWhatsAppLink';
import { catalogueDisplayPrice, chairCode, formatCataloguePrice } from './catalogueUtils';
import styles from './catalogueCard.module.css';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CatalogueProductCard({ product, onOpen }) {
  const image = resolveImageUrl(product?.images?.[0]);
  const swatches = buildColorSwatchItems(product);
  const code = chairCode(product);
  const price = formatCataloguePrice(catalogueDisplayPrice(product));

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardMain}
        onClick={() => onOpen?.(product)}
        aria-label={`View ${code}`}
      >
        <div className={styles.imageWrap}>
          {image ? (
            <img src={image} alt="" className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>No image</div>
          )}
        </div>
        <div className={styles.body}>
          {swatches.length > 0 ? (
            <div className={styles.swatches}>
              <ColorSwatches items={swatches} size="sm" stopPropagation />
            </div>
          ) : (
            <div className={styles.swatchesPlaceholder} aria-hidden />
          )}
          <p className={styles.chairCode}>{code}</p>
        </div>
      </button>
      <div className={styles.priceRow}>
        <p className={styles.price}>{price}</p>
        <CatalogueWhatsAppLink chairCode={code} size="sm" />
      </div>
    </article>
  );
}
