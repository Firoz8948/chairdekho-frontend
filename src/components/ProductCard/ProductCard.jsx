'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ColorSwatches, {
  buildColorSwatchItems,
  productColorHref,
  resolveCardImages,
} from '@/components/ColorSwatches/ColorSwatches';
import { productEnquiryUrl } from '@/lib/whatsapp';
import cardStyles from './ProductCard.module.css';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Storefront product card — gallery prefers active color variant images.
 */
export default function ProductCard({
  product,
  styles,
  formatPrice,
  onAddToBag,
  className = '',
}) {
  const router = useRouter();
  const swatches = useMemo(() => buildColorSwatchItems(product), [product]);
  const defaultSwatch = swatches.find((s) => s.is_current) || swatches[0] || null;
  const [activeSwatch, setActiveSwatch] = useState(defaultSwatch);

  const gallery = useMemo(() => {
    const urls = resolveCardImages(product, activeSwatch || defaultSwatch);
    return urls.map(resolveImageUrl).filter(Boolean);
  }, [product, activeSwatch, defaultSwatch]);

  const primaryImage = gallery[0] || null;
  const hoverImage = gallery[1] || null;
  const href = (() => {
    const base = product.slug ? `/products/${product.slug}` : '/shop';
    if (activeSwatch?.option_id != null) {
      return productColorHref(activeSwatch) || base;
    }
    if (activeSwatch?.slug && activeSwatch.slug !== product.slug) {
      return productColorHref(activeSwatch) || base;
    }
    return base;
  })();
  const hasDiscount =
    product.mrp != null && Number(product.mrp) > Number(product.price);
  const hasHoverImage = Boolean(hoverImage);

  const itemsWithSelection = swatches.map((s) => ({
    ...s,
    is_current:
      activeSwatch != null
        ? String(s.id) === String(activeSwatch.id) ||
          (s.option_id != null &&
            activeSwatch.option_id != null &&
            s.option_id === activeSwatch.option_id)
        : s.is_current,
  }));

  const goToSwatch = (item) => {
    setActiveSwatch(item);
    const next = productColorHref(item);
    if (next) router.push(next);
  };

  return (
    <article
      className={`${styles.productCard} ${hasHoverImage ? styles.productCardHasHoverImg : ''} ${className}`.trim()}
    >
      <div className={styles.productImageWrap}>
        <Link href={href} className={styles.productImageLink}>
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt={product.name}
                className={`${styles.productImage} ${styles.productImagePrimary}`}
                loading="lazy"
              />
              {hasHoverImage && (
                <img
                  src={hoverImage}
                  alt=""
                  aria-hidden="true"
                  className={`${styles.productImage} ${styles.productImageSecondary}`}
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className={styles.productImagePlaceholder}>No image</div>
          )}
        </Link>
      </div>

      <div className={cardStyles.swatchStrip}>
        {itemsWithSelection.length > 0 ? (
          <ColorSwatches
            items={itemsWithSelection}
            size="sm"
            className={cardStyles.swatchRow}
            stopPropagation
            onPreview={(item) => setActiveSwatch(item)}
            onSelect={goToSwatch}
          />
        ) : null}
      </div>

      <div className={styles.productBody}>
        <Link href={href} className={styles.productInfoLink}>
          {product.category && (
            <span className={styles.productCategory}>{product.category}</span>
          )}
          <h3 className={styles.productName}>{product.name}</h3>
          <div className={styles.productPricing}>
            <span className={styles.productPrice}>{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className={styles.productMrp}>{formatPrice(product.mrp)}</span>
            )}
          </div>
        </Link>

        <div className={styles.productCardActions}>
          {onAddToBag ? (
            <button
              type="button"
              className={styles.productBuyNowBtn}
              onClick={(e) => onAddToBag(e, product, activeSwatch)}
            >
              Add to Cart
            </button>
          ) : null}
          <a
            href={productEnquiryUrl(product.name, href)}
            target="_blank"
            rel="noopener noreferrer"
            className={cardStyles.whatsappBtn}
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            title="Enquire on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.43-9.44 9.43zm8.03-17.47A11.3 11.3 0 0 0 12.05.7C5.79.7.7 5.8.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.4l5.82-1.53a11.3 11.3 0 0 0 5.63 1.43h.01c6.25 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.02z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}
