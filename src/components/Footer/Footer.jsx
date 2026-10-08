import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { FEATURES } from '@/lib/features';
import SocialLinks from '@/components/SocialLinks/SocialLinks';
import { CONTACT } from '@/lib/seo';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.brandCol}>
            <Logo size="lg" className={styles.brandLogoLink} />
            <p className={styles.brandDesc}>
              All types of chairs at affordable prices – plastic, arm, dining,
              garden, office and kids chairs, delivered across Vasai, Virar and
              Nalasopara.
            </p>
            <SocialLinks className={styles.socialRow} />
            <div className={styles.brandCopyright}>
              <p>© {new Date().getFullYear()} ChairDekho. All rights reserved.</p>
              <p className={styles.brandOf}>A brand of PrimeCraft</p>
              <p className={styles.gstin}>GST - {CONTACT.gstin}</p>
            </div>
          </div>

          <div className={styles.quickCol}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <div className={styles.linkList}>
              <Link href="/shop" className={styles.link}>
                Shop Collection
              </Link>
              {FEATURES.watchAndShop && (
                <Link href="/watch-and-shop" className={styles.link}>
                  Watch &amp; Shop
                </Link>
              )}
              <Link href="/about" className={styles.link}>
                About Us
              </Link>
              <Link href="/contact-us" className={styles.link}>
                Contact Us
              </Link>
              <Link href="/faqs" className={styles.link}>
                FAQs
              </Link>
            </div>
          </div>

          <div className={styles.policyCol}>
            <h3 className={styles.colTitle}>Policies</h3>
            <div className={styles.linkList}>
              <Link href="/policy/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>
              <Link href="/policy/terms-and-conditions" className={styles.link}>
                Terms &amp; Conditions
              </Link>
              <Link href="/policy/shipping-policy" className={styles.link}>
                Shipping Policy
              </Link>
              <Link href="/policy/refund-policy" className={styles.link}>
                Returns &amp; Refunds
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <div className={styles.copyrightGroup}>
            <span>© {new Date().getFullYear()} ChairDekho. All rights reserved.</span>
            <span className={styles.brandOf}>A brand of PrimeCraft</span>
            <span className={styles.gstin}>GST - {CONTACT.gstin}</span>
          </div>
        </div>
      </footer>

      <div className={styles.credit}>
        <span>
          Developed &amp; Managed by{' '}
          <a
            href="https://zyatechpvt.website"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.creditLink}
          >
            Zyatech Private Limited
          </a>
        </span>
        <a
          href="https://zyatechpvt.website"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.creditBtn}
          aria-label="Visit Zyatech Private Limited website"
          title="zyatechpvt.website"
        >
          <ArrowUpRight size={16} strokeWidth={2.25} aria-hidden="true" />
        </a>
      </div>
    </>
  );
}
