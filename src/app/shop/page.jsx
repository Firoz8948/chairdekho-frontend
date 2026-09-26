import { Suspense } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import JsonLd from '@/components/Seo/JsonLd';
import { buildBreadcrumbJsonLd, buildCategorySeo, fetchApi, pageMetadata } from '@/lib/seo';
import ShopScreen from './components/ShopScreen';
import styles from './shop.module.css';

const SHOP_TITLE = 'Shop Leather Wallets, Bags & Belts for Men & Women | Lansdowne';
const SHOP_DESCRIPTION =
  'Browse 100% genuine leather wallets, card holders, handbags, sling bags, laptop bags and belts for men and women. Secure checkout & cash on delivery.';

async function findCategory(searchParams) {
  const slug = typeof searchParams?.category === 'string' ? searchParams.category.trim() : '';
  if (!slug) return { slug: '', category: null };
  const res = await fetchApi('/categories/', { revalidate: 300 });
  const list = Array.isArray(res.data) ? res.data : [];
  return { slug, category: list.find((c) => c.slug === slug) || null };
}

export async function generateMetadata({ searchParams }) {
  const { slug, category } = await findCategory(searchParams);
  if (!slug) {
    return pageMetadata({ title: SHOP_TITLE, description: SHOP_DESCRIPTION, path: '/shop' });
  }
  if (!category) {
    return pageMetadata({
      title: SHOP_TITLE,
      description: SHOP_DESCRIPTION,
      path: '/shop',
      noindex: true,
    });
  }
  const { title, description } = buildCategorySeo(category);
  return pageMetadata({
    title,
    description,
    path: `/shop?category=${encodeURIComponent(category.slug)}`,
    noindex: Boolean(category.is_reels),
    images: category.image ? [{ url: category.image, alt: category.name }] : undefined,
  });
}

export default async function ShopPage({ searchParams }) {
  const { category } = await findCategory(searchParams);
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    ...(category
      ? [{ name: category.name, path: `/shop?category=${encodeURIComponent(category.slug)}` }]
      : []),
  ];

  return (
    <div className={styles.container}>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Header />
      <main className={styles.main}>
        <Suspense
          fallback={
            <div className={styles.shopContent}>
              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Shop</h1>
                <p className={styles.pageSubtitle}>Loading collection…</p>
              </div>
            </div>
          }
        >
          <ShopScreen />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
