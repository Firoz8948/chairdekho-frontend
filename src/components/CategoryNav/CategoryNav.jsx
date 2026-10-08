'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import productService from '@/lib/services/products';
import styles from './categoryNav.module.css';

// Header remounts on every page, so keep one categories request per session.
let categoriesRequest = null;
const loadCategories = () => {
  if (!categoriesRequest) {
    categoriesRequest = productService
      .getCategories()
      .then((data) =>
        Array.isArray(data) ? data.filter((c) => c.is_active !== false && !c.is_reels) : []
      )
      .catch(() => {
        categoriesRequest = null;
        return [];
      });
  }
  return categoriesRequest;
};

function CategoryNavBar({ activeSlug }) {
  const [categories, setCategories] = useState([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    loadCategories().then((list) => mounted && setCategories(list));
    return () => {
      mounted = false;
    };
  }, []);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    updateArrows();
    track.addEventListener('scroll', updateArrows, { passive: true });
    const observer = new ResizeObserver(updateArrows);
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', updateArrows);
      observer.disconnect();
    };
  }, [updateArrows, categories]);

  useEffect(() => {
    const track = trackRef.current;
    const active = track?.querySelector('[aria-current="page"]');
    if (!track || !active) return;
    const left = active.offsetLeft - track.offsetLeft - (track.clientWidth - active.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
  }, [activeSlug, categories]);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.7, behavior: 'smooth' });
  };

  if (categories.length === 0) return null;

  const links = [{ slug: '', name: 'All Chairs' }, ...categories];
  const overflowing = canPrev || canNext;

  return (
    <nav className={styles.bar} aria-label="Shop by category">
      <div className={styles.inner}>
        {overflowing && (
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            aria-label="Previous categories"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <div ref={trackRef} className={styles.track}>
          {links.map((cat) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={cat.slug || 'all'}
                href={cat.slug ? `/shop?category=${encodeURIComponent(cat.slug)}` : '/shop'}
                className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {overflowing && (
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            aria-label="More categories"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </nav>
  );
}

function CategoryNavWithParams() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSlug = pathname === '/shop' ? searchParams.get('category') || '' : null;
  return <CategoryNavBar activeSlug={activeSlug} />;
}

export default function CategoryNav() {
  return (
    <Suspense fallback={<CategoryNavBar activeSlug={null} />}>
      <CategoryNavWithParams />
    </Suspense>
  );
}
