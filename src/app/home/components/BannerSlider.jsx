'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ImagePlus } from 'lucide-react';
import { BANNER_SIZES } from '@/lib/banners';
import styles from './banner.module.css';

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

function SlideLink({ href, children }) {
  if (!href) return children;
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={styles.slideLink}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={styles.slideLink} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function BannerPlaceholder({ device }) {
  const size = BANNER_SIZES[device];
  return (
    <div
      className={styles.placeholder}
      style={{ aspectRatio: `${size.width} / ${size.height}` }}
      role="img"
      aria-label={`${size.label} banner placeholder`}
    >
      <div className={styles.placeholderInner}>
        <ImagePlus size={device === 'mobile' ? 32 : 40} strokeWidth={1.5} />
        <p className={styles.placeholderTitle}>
          {size.label} Banner · {size.width} × {size.height} px
        </p>
        <p className={styles.placeholderHint}>Upload from Admin → Banners</p>
      </div>
    </div>
  );
}

export default function BannerSlider({ slides, device }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const count = slides.length;
  const size = BANNER_SIZES[device];

  const goTo = useCallback((next) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return <BannerPlaceholder device={device} />;

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchEnd = (e) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (start == null) return;
    const delta = e.changedTouches[0].clientX - start;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) goTo(index + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      className={styles.slider}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className={styles.viewport} style={{ aspectRatio: `${size.width} / ${size.height}` }}>
        <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={styles.slide}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              <SlideLink href={slide.href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  width={size.width}
                  height={size.height}
                  className={styles.slideImage}
                  loading="lazy"
                  decoding="async"
                  fetchpriority={i === 0 ? 'high' : 'low'}
                  draggable={false}
                />
              </SlideLink>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(index - 1)}
            aria-label="Previous banner"
          >
            <ChevronLeft size={18} />
          </button>
          <div className={styles.dots}>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to banner ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(index + 1)}
            aria-label="Next banner"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
