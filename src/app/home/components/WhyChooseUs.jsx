import Image from 'next/image';
import styles from '../home.module.css';

const PRINCIPLES = [
  {
    num: '01',
    title: 'Variety',
    desc: 'All types of chairs in one place – plastic, arm, dining, garden, office and kids.',
    icon: '/images/trust/designs.webp',
  },
  {
    num: '02',
    title: 'Price',
    desc: 'Affordable prices on every chair. Bulk orders for homes, shops and events welcome.',
    icon: '/images/trust/valueformoney.webp',
  },
  {
    num: '03',
    title: 'Comfort',
    desc: 'Sturdy, comfortable chairs built for everyday use, indoors and outdoors.',
    icon: '/images/trust/quality.webp',
  },
  {
    num: '04',
    title: '5 Star Ratings',
    desc: 'Rated 5 stars on Google by happy customers across Vasai, Virar and Nalasopara.',
    icon: '/images/trust/rating.webp',
  },
];

export default function WhyChooseUs({ title = 'WHY CHAIRDEKHO', subtitle = 'What we stand by' }) {
  return (
    <section className={`${styles.section} ${styles.featuresSection}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
      </div>

      <ul className={styles.principlesList}>
        {PRINCIPLES.map((item) => (
          <li key={item.num} className={styles.principleItem}>
            <span className={styles.principleNum} aria-hidden="true">
              {item.num}
            </span>
            <div className={styles.principleIcon}>
              <Image src={item.icon} alt="" width={400} height={400} sizes="(max-width: 768px) 96px, 140px" />
            </div>
            <h3 className={styles.principleTitle}>{item.title}</h3>
            <p className={styles.principleDesc}>{item.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
