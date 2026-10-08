'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/seo';
import styles from '../home.module.css';

const PHONE_HREF = `tel:${CONTACT.phone.replace(/\s+/g, '')}`;

export default function WhoWeAre() {
  const videoRef = useRef(null);

  // Only download/play the (large) clip while it is on screen
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === 'undefined') return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!reduceMotion) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.section} ${styles.aboutSection}`}>
      <div className={styles.aboutGrid}>
        <div className={styles.aboutVideoFrame}>
          <video
            ref={videoRef}
            className={styles.aboutVideo}
            src="/assets/intro.mp4"
            poster="/assets/intro-poster.jpg"
            muted
            loop
            playsInline
            controls
            preload="none"
            aria-label="A look inside the ChairDekho chair shop in Nalasopara West"
          />
        </div>

        <div className={styles.aboutContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>WHO WE ARE</h2>
            <p className={styles.sectionSubtitle}>
              The biggest chair wholesale shop in Vasai - Virar
            </p>
          </div>

          <p className={styles.aboutText}>
            ChairDekho gives you all types of chairs under one roof – regular plastic chairs,
            arm and armless chairs, stacking chairs, dining sets, stools, tables and kids’
            chairs, for indoors and outdoors.
          </p>
          <p className={styles.aboutText}>
            Furnishing a home, housing society, office, shop or event? We supply single pieces
            and bulk orders at wholesale prices, with durable, quality-checked chairs from
            trusted brands like Prime.
          </p>
          <p className={styles.aboutText}>
            Visit us near Umadevi Mandir, Nalasopara West, or order online for quick delivery
            across Vasai, Virar and Nalasopara.
          </p>

          <div className={styles.aboutActions}>
            <Link href="/shop" className={`${styles.aboutBtn} ${styles.aboutBtnPrimary}`}>
              Shop Now <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href={PHONE_HREF} className={`${styles.aboutBtn} ${styles.aboutBtnSecondary}`}>
              <Phone size={16} aria-hidden="true" /> Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
