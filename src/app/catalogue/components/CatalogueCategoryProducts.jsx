'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import railStyles from '@/app/home/components/categoryRail.module.css';
import styles from './catalogueProductRail.module.css';
import CatalogueProductCard from './CatalogueProductCard';

export default function CatalogueCategoryProducts({ products, onOpen }) {
  const railRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(0);

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
  }, [updatePaging, products]);

  const goToPage = (next) => {
    const rail = railRef.current;
    if (!rail || pageCount < 2) return;
    const target = ((next % pageCount) + pageCount) % pageCount;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    rail.scrollTo({ left: (maxScroll * target) / (pageCount - 1), behavior: 'smooth' });
  };

  if (!products?.length) return null;

  return (
    <div className={styles.railWrap}>
      <div ref={railRef} className={styles.rail}>
        {products.map((product) => (
          <CatalogueProductCard key={product.id} product={product} onOpen={onOpen} />
        ))}
      </div>

      {pageCount > 1 && (
        <div className={railStyles.controls}>
          <button
            type="button"
            className={railStyles.arrow}
            onClick={() => goToPage(page - 1)}
            aria-label="Previous products"
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
                aria-label={`Go to product page ${i + 1}`}
                aria-current={i === page}
              />
            ))}
          </div>
          <button
            type="button"
            className={railStyles.arrow}
            onClick={() => goToPage(page + 1)}
            aria-label="Next products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
