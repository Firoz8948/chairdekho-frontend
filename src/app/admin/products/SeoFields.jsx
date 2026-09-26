'use client';

import { useMemo } from 'react';
import { SITE_URL, buildProductDescription, buildProductTitle } from '@/lib/seo';
import styles from './products.module.css';

const TITLE_LIMIT = 65;
const DESCRIPTION_LIMIT = 160;

export default function SeoFields({
  name,
  description,
  price,
  metafields,
  slug,
  seoTitle,
  seoDescription,
  onSeoTitleChange,
  onSeoDescriptionChange,
}) {
  const auto = useMemo(() => {
    const draft = { name, description, price, metafields };
    return {
      title: buildProductTitle(draft),
      description: buildProductDescription(draft),
    };
  }, [name, description, price, metafields]);

  const previewTitle = seoTitle.trim() || auto.title;
  const previewDescription = seoDescription.trim() || auto.description;
  const host = SITE_URL.replace(/^https?:\/\//, '');

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionTitle}>SEO</h2>
      <p className={styles.sectionHint}>
        Title and description are generated automatically from the product name, description,
        price and highlights. Fill these only to override the automatic text.
      </p>

      <div className={styles.seoPreview}>
        <span className={styles.seoPreviewUrl}>
          {host} › products › {slug || 'new-product'}
        </span>
        <span className={styles.seoPreviewTitle}>{previewTitle}</span>
        <span className={styles.seoPreviewDesc}>{previewDescription}</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>SEO Title (optional)</label>
        <input
          className={styles.formInput}
          value={seoTitle}
          maxLength={200}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder={auto.title}
        />
        <span
          className={`${styles.formHint} ${
            seoTitle.length > TITLE_LIMIT ? styles.seoCountOver : ''
          }`}
        >
          {seoTitle.length}/{TITLE_LIMIT} recommended characters
          {seoTitle.trim() ? '' : ' · using automatic title'}
        </span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Meta Description (optional)</label>
        <textarea
          className={styles.formTextarea}
          value={seoDescription}
          maxLength={320}
          onChange={(e) => onSeoDescriptionChange(e.target.value)}
          placeholder={auto.description}
        />
        <span
          className={`${styles.formHint} ${
            seoDescription.length > DESCRIPTION_LIMIT ? styles.seoCountOver : ''
          }`}
        >
          {seoDescription.length}/{DESCRIPTION_LIMIT} recommended characters
          {seoDescription.trim() ? '' : ' · using automatic description'}
        </span>
      </div>
    </section>
  );
}
