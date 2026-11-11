'use client';

import ColorSwatches, { buildColorSwatchItems } from '@/components/ColorSwatches/ColorSwatches';
import styles from './catalogueCard.module.css';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

function chairCode(product) {
  if (product?.catalogue_code) return product.catalogue_code;
  const n = product?.catalogue_number;
  if (n != null && n !== '') {
    return `CHAIRDEKHO-${String(n).padStart(2, '0')}`;
  }
  return 'CHAIRDEKHO-—';
}

export default function CatalogueProductCard({ product, onOpen }) {
  const image = resolveImageUrl(product?.images?.[0]);
  const swatches = buildColorSwatchItems(product);
  const code = chairCode(product);

  return (
    <button type="button" className={styles.card} onClick={() => onOpen?.(product)} aria-label={code}>
      <div className={styles.imageWrap}>
        {image ? (
          <img src={image} alt="" className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.imagePlaceholder}>No image</div>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.chairCode}>{code}</p>
        {swatches.length > 0 ? (
          <div className={styles.swatches}>
            <ColorSwatches items={swatches} size="sm" stopPropagation />
          </div>
        ) : null}
      </div>
    </button>
  );
}
