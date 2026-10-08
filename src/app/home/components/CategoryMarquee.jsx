'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Armchair } from 'lucide-react';
import productService from '@/lib/services/products';
import styles from './categoryMarquee.module.css';

const SPEED_DESKTOP = 45; // px per second
const SPEED_MOBILE = 60;
const DWELL_MS = 1600; // how long the centred item holds on mobile
const MIN_SLOT_PX = 120; // smallest item + gap, used to decide how many copies fill the screen

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CategoryMarquee() {
  const [categories, setCategories] = useState([]);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    productService
      .getCategories()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setCategories(data.filter((cat) => cat.is_active && !cat.is_reels));
        }
      })
      .catch((err) => console.error('Failed to load categories:', err));
    return () => {
      mounted = false;
    };
  }, []);

  // Enough copies that one full set can scroll off-screen with no gap on wide monitors
  const copies = useMemo(() => {
    if (!categories.length) return 0;
    return Math.max(2, Math.ceil(2560 / (categories.length * MIN_SLOT_PX)) + 1);
  }, [categories.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || !copies) return undefined;

    const items = Array.from(track.children);
    const perSet = categories.length;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileQuery = window.matchMedia('(hover: none), (max-width: 768px)');

    let x = 0;
    let last = 0;
    let rafId = 0;
    let visible = true;
    let hovering = false;
    let mode = 'moving'; // mobile: 'moving' | 'dwell'
    let dwellUntil = 0;
    let target = -1;
    let active = null;

    const setWidth = () => items[perSet].offsetLeft - items[0].offsetLeft;
    const centreOf = (el) => el.offsetLeft + el.offsetWidth / 2 + x;

    const setActive = (el) => {
      if (active === el) return;
      active?.classList.remove(styles.itemActive);
      active = el;
      active?.classList.add(styles.itemActive);
    };

    const pickNextTarget = () => {
      const mid = viewport.clientWidth / 2;
      let best = -1;
      let bestCentre = Infinity;
      items.forEach((el, i) => {
        const c = centreOf(el);
        if (c > mid + 2 && c < bestCentre) {
          bestCentre = c;
          best = i;
        }
      });
      target = best;
    };

    const wrap = () => {
      const w = setWidth();
      if (w > 0 && x <= -w) {
        x += w;
        if (target >= perSet) target -= perSet;
      }
    };

    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const isMobile = mobileQuery.matches;
      const mid = viewport.clientWidth / 2;

      if (!isMobile) {
        if (active) setActive(null);
        if (!hovering) {
          x -= SPEED_DESKTOP * dt;
          wrap();
        }
      } else if (mode === 'dwell') {
        // Keep the growing item pinned to the centre while its size transitions
        if (active) x += mid - centreOf(active);
        if (now >= dwellUntil) {
          setActive(null);
          mode = 'moving';
          pickNextTarget();
        }
      } else {
        if (target < 0) pickNextTarget();
        x -= SPEED_MOBILE * dt;
        wrap();
        const el = items[target];
        if (el && centreOf(el) <= mid) {
          x += mid - centreOf(el);
          setActive(el);
          mode = 'dwell';
          dwellUntil = now + DWELL_MS;
        }
      }

      track.style.transform = `translate3d(${x}px, 0, 0)`;
      rafId = visible ? requestAnimationFrame(tick) : 0;
    };

    const start = () => {
      if (reduceMotion || rafId) return;
      last = 0;
      rafId = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      if (!mobileQuery.matches) hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    track.addEventListener('mouseenter', onEnter);
    track.addEventListener('mouseleave', onLeave);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(viewport);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      track.removeEventListener('mouseenter', onEnter);
      track.removeEventListener('mouseleave', onLeave);
      setActive(null);
    };
  }, [categories, copies]);

  if (!categories.length) return null;

  const loop = Array.from({ length: copies }, (_, copy) =>
    categories.map((cat) => ({ cat, copy }))
  ).flat();

  return (
    <div className={styles.marquee} role="region" aria-label="Shop by category">
      <div ref={viewportRef} className={styles.viewport}>
        <ul ref={trackRef} className={styles.track}>
          {loop.map(({ cat, copy }) => {
            const img = resolveImageUrl(cat.image_url);
            const isClone = copy > 0;
            return (
              <li key={`${copy}-${cat.id}`} className={styles.item} aria-hidden={isClone || undefined}>
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className={styles.link}
                  tabIndex={isClone ? -1 : undefined}
                >
                  <span className={styles.media}>
                    {img ? (
                      <img src={img} alt="" className={styles.image} loading="lazy" draggable="false" />
                    ) : (
                      <Armchair className={styles.fallback} strokeWidth={1.25} aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles.caption}>
                    <span className={styles.name}>{cat.name}</span>
                    <span className={styles.shop} aria-hidden="true">Shop</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
