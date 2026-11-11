'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { CategoryShowcase } from '@/app/home/components';
import catalogueService from '@/lib/services/catalogue';
import styles from '../catalogue.module.css';
import CatalogueProductCard from './CatalogueProductCard';
import CatalogueDetailModal from './CatalogueDetailModal';

export default function CatalogueScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    catalogueService
      .getCatalogue()
      .then((data) => {
        if (!mounted) return;
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      })
      .catch(() => mounted && setCategories([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <CategoryShowcase />

        {loading ? (
          <p className={styles.loading}>Loading catalogue…</p>
        ) : categories.length === 0 ? (
          <p className={styles.empty}>No products in the catalogue yet.</p>
        ) : (
          categories.map((block) => (
            <section key={block.id} className={styles.section} aria-labelledby={`cat-${block.id}`}>
              <h2 id={`cat-${block.id}`} className={styles.sectionTitle}>
                {block.name}
              </h2>
              <div className={styles.track}>
                {block.products.map((product) => (
                  <CatalogueProductCard
                    key={product.id}
                    product={product}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
      <Footer />
      {selected ? (
        <CatalogueDetailModal product={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
