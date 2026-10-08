import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';
import styles from '../home.module.css';

export default function TrustBar() {
  const items = [
    {
      icon: <ShieldCheck size={22} />,
      title: 'Quality Checked',
      desc: 'Sturdy chairs, every piece inspected',
    },
    {
      icon: <Truck size={22} />,
      title: 'Fast Local Delivery',
      desc: 'Quick delivery in Vasai Virar',
    },
    {
      icon: <RotateCcw size={22} />,
      title: 'Easy Returns',
      desc: '7-day hassle-free returns',
    },
    {
      icon: <Headphones size={22} />,
      title: 'Dedicated Support',
      desc: 'Personalized customer care',
    },
  ];

  return (
    <div className={styles.trustBar}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.trustItem}>
          <div className={styles.trustIcon}>{item.icon}</div>
          <div>
            <div className={styles.trustTitle}>{item.title}</div>
            <div className={styles.trustDesc}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
