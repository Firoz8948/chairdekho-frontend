import { fetchApi } from '@/lib/seo';
import { resolveBannerUrl } from '@/lib/banners';
import BannerSlider from './BannerSlider';
import styles from './banner.module.css';

async function getSlides(device) {
  const { data } = await fetchApi(`/banners/?device=${device}`, { revalidate: 30 });
  if (!Array.isArray(data)) return [];
  return data
    .filter((slide) => slide.image_url)
    .map((slide) => ({
      id: slide.id,
      src: resolveBannerUrl(slide.image_url),
      alt: slide.title || 'ChairDekho – chairs in Vasai Virar',
      href: slide.link_url || '',
    }));
}

export default async function HomeBanner() {
  const [desktopSlides, mobileSlides] = await Promise.all([
    getSlides('desktop'),
    getSlides('mobile'),
  ]);

  return (
    <section className={styles.banner} aria-labelledby="home-banner-heading">
      <h1 id="home-banner-heading" className={styles.srOnly}>
        ChairDekho – All Types of Chairs at Affordable Prices in Vasai Virar
      </h1>
      <div className={styles.desktopOnly}>
        <BannerSlider slides={desktopSlides} device="desktop" />
      </div>
      <div className={styles.mobileOnly}>
        <BannerSlider slides={mobileSlides} device="mobile" />
      </div>
    </section>
  );
}
