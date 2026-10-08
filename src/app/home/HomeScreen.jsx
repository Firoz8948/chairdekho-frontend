import styles from './home.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import {
  HomeBanner,
  CategoryShowcase,
  ProductShowcase,
  WhyChooseUs,
  ReviewsShowcase,
  GoogleReviews,
  WhoWeAre,
  CategoryMarquee,
} from './components';

export default function HomeScreen() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <HomeBanner />
        <CategoryShowcase />
        <ProductShowcase />
        <WhyChooseUs />
        <ReviewsShowcase />
        <WhoWeAre />
        <CategoryMarquee />
        <GoogleReviews />
      </main>
      <Footer />
    </div>
  );
}
