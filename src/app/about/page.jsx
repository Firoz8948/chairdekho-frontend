import Image from 'next/image';
import styles from './about.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageHeroBanner from '@/components/PageHeroBanner/PageHeroBanner';
import { Store, PackageCheck, BadgeCheck, Wallet } from 'lucide-react';
import WhyChooseUs from '@/app/home/components/WhyChooseUs';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About Us | ChairDekho – Chair Shop in Vasai Virar',
  description:
    'ChairDekho is your local chair shop in Nalasopara, Vasai-Virar. All types of chairs – plastic, arm, dining, garden, office and kids – at affordable prices.',
  path: '/about',
});

const WHY_POINTS = [
  {
    icon: Store,
    title: 'See It Before You Buy',
    desc: 'Visit our shop near Umadevi Mandir, Nalasopara West, and sit on every chair before you decide.',
  },
  {
    icon: PackageCheck,
    title: 'Retail & Wholesale',
    desc: 'One chair for your home or hundreds for a banquet hall – bulk orders get wholesale rates.',
  },
  {
    icon: BadgeCheck,
    title: 'Trusted Brands',
    desc: 'Durable chairs from names like Prime, checked by our team before every dispatch.',
  },
  {
    icon: Wallet,
    title: 'Pay Your Way',
    desc: 'Cash on delivery, UPI, cards or net banking, all through a secure checkout.',
  },
];

const WHY_STATS = [
  { value: '5.0★', label: 'Google rating' },
  { value: '100+', label: 'Happy reviews' },
  { value: '10–7', label: 'Open Mon–Sat' },
];

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Header />
      <PageHeroBanner
        title="About ChairDekho"
        subtitle="All types of chairs, at affordable prices, in Vasai Virar."
      />

      <main className={styles.main}>
        {/* ── Our Story ── */}
        <section className={styles.storySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>OUR STORY</h2>
            <p className={styles.sectionSubtitle}>A Chair for Every Space</p>
          </div>

          <div className={styles.storyContent}>
            <div className={styles.storyMedia}>
              <Image
                src="/images/brand/chakladekho.webp"
                alt="ChairDekho logo"
                width={1200}
                height={542}
                sizes="(max-width: 900px) 100vw, 520px"
                className={styles.storyImage}
              />
            </div>
            <div className={styles.storyText}>
              <p className={styles.paragraph}>
                ChairDekho started with a simple idea: buying a good chair should be easy and
                affordable. From plastic chairs and arm chairs to dining, garden, office and kids
                chairs, we bring all types of chairs together in one place.
              </p>
              <p className={styles.paragraph}>
                Proudly based in Nalasopara West, Vasai-Virar, we supply chairs to homes, shops,
                offices, restaurants and events across Vasai, Virar and Nalasopara.
              </p>
            </div>
          </div>
        </section>

        {/* ── Our Values ── */}
        <div className={styles.valuesWrap}>
          <WhyChooseUs title="OUR VALUES" subtitle="What We Stand For" />
        </div>

        {/* ── Why ChairDekho ── */}
        <section className={styles.whySection}>
          <div className={styles.whyCard}>
            <div className={styles.whyIntro}>
              <h2 className={styles.whyTitle}>WHY CHAIRDEKHO</h2>
              <p className={styles.whySubtitle}>Your neighbourhood chair wholesaler</p>
              <p className={styles.whyLead}>
                From a single chair for your balcony to hundreds for a wedding hall, we make buying
                chairs in Vasai-Virar simple, honest and quick.
              </p>
              <ul className={styles.whyStats}>
                {WHY_STATS.map((stat) => (
                  <li key={stat.label} className={styles.whyStat}>
                    <strong className={styles.whyStatValue}>{stat.value}</strong>
                    <span className={styles.whyStatLabel}>{stat.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className={styles.whyGrid}>
              {WHY_POINTS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className={styles.whyItem}>
                  <span className={styles.whyIcon}>
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className={styles.whyItemTitle}>{title}</h3>
                  <p className={styles.whyItemDesc}>{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
