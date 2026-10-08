'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Armchair, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import productService from '@/lib/services/products';
import styles from '../home.module.css';
import railStyles from './categoryRail.module.css';

const CIRCLE_COLORS = [
  '#fdecec', // rose
  '#e6f2fc', // sky
  '#e8f6ec', // mint
  '#fff4d9', // butter
  '#efe9fb', // lavender
  '#e3f6f4', // aqua
  '#fdeee4', // peach
  '#edf0f5', // mist
];

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(0);
  const railRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        if (isMounted && Array.isArray(data)) {
          setCategories(data.filter((cat) => cat.is_active && !cat.is_reels));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const updatePaging = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const pages = maxScroll > 4 ? Math.ceil(rail.scrollWidth / rail.clientWidth) : 1;
    setPageCount(pages);
    setPage(pages > 1 ? Math.round((rail.scrollLeft / maxScroll) * (pages - 1)) : 0);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    updatePaging();
    rail.addEventListener('scroll', updatePaging, { passive: true });
    const observer = new ResizeObserver(updatePaging);
    observer.observe(rail);
    return () => {
      rail.removeEventListener('scroll', updatePaging);
      observer.disconnect();
    };
  }, [updatePaging, categories, loading]);

  const goToPage = (next) => {
    const rail = railRef.current;
    if (!rail || pageCount < 2) return;
    const target = ((next % pageCount) + pageCount) % pageCount;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    rail.scrollTo({ left: (maxScroll * target) / (pageCount - 1), behavior: 'smooth' });
  };

  return (
    <section className={`${styles.section} ${styles.categorySection}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>SHOP CHAIRS BY TYPE</h2>
        <div className={styles.sectionTitleRow}>
          <p className={styles.sectionSubtitle}>The right chair for every space</p>
          <Link href="/shop" className={styles.sectionLink}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {!loading && categories.length === 0 ? (
        <div className={styles.categoryEmpty}>
          <p>No categories published yet. Add categories from the Admin Portal.</p>
        </div>
      ) : (
        <div className={railStyles.railWrap}>
          <div ref={railRef} className={railStyles.rail}>
            {loading
              ? Array.from({ length: 6 }, (_, n) => (
                  <div key={n} className={railStyles.item} aria-hidden="true">
                    <span className={`${railStyles.circle} ${railStyles.skeleton}`} />
                    <span className={railStyles.skeletonText} />
                  </div>
                ))
              : categories.map((cat, idx) => {
                  const img = resolveImageUrl(cat.image_url);
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                      className={railStyles.item}
                    >
                      <span
                        className={railStyles.circle}
                        style={{ '--circle-bg': CIRCLE_COLORS[idx % CIRCLE_COLORS.length] }}
                      >
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className={railStyles.image} loading="lazy" />
                        ) : (
                          <Armchair className={railStyles.fallbackIcon} strokeWidth={1.25} />
                        )}
                      </span>
                      <span className={railStyles.name}>{cat.name}</span>
                    </Link>
                  );
                })}
          </div>

          {pageCount > 1 && (
            <div className={railStyles.controls}>
              <button
                type="button"
                className={railStyles.arrow}
                onClick={() => goToPage(page - 1)}
                aria-label="Previous categories"
              >
                <ChevronLeft size={18} />
              </button>
              <div className={railStyles.dots}>
                {Array.from({ length: pageCount }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${railStyles.dot} ${i === page ? railStyles.dotActive : ''}`}
                    onClick={() => goToPage(i)}
                    aria-label={`Go to category page ${i + 1}`}
                    aria-current={i === page}
                  />
                ))}
              </div>
              <button
                type="button"
                className={railStyles.arrow}
                onClick={() => goToPage(page + 1)}
                aria-label="Next categories"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
