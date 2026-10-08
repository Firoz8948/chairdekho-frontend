'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import authService from '@/lib/services/auth';
import { CONTACT } from '@/lib/seo';
import Logo from '@/components/Logo/Logo';
import SocialLinks from '@/components/SocialLinks/SocialLinks';
import CategoryNav from '@/components/CategoryNav/CategoryNav';
import { FEATURES } from '@/lib/features';
import styles from './header.module.css';

const DRAWER_ANIMATION_MS = 300;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [accountHref, setAccountHref] = useState('/account/login');
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    setAccountHref(authService.isLoggedIn() ? '/account' : '/account/login');
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    if (!mobileMenuOpen || mobileMenuClosing) return;
    setMobileMenuClosing(true);
    window.setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, DRAWER_ANIMATION_MS);
  }, [mobileMenuOpen, mobileMenuClosing]);

  const openMobileMenu = () => {
    setMobileMenuClosing(false);
    setMobileMenuOpen(true);
  };

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) closeMobileMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen || mobileMenuClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, mobileMenuClosing]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    FEATURES.watchAndShop && { label: 'Watch & Shop', href: '/watch-and-shop' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact-us' },
  ].filter(Boolean);

  const phoneHref = `tel:+${CONTACT.whatsapp}`;

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.topBarMapLink}
            title="View on Google Maps"
          >
            <span className={styles.topBarTagline}>Best Chairs in Vasai Virar</span>
            <span className={styles.topBarMapBtn} aria-hidden="true">
              <ArrowUpRight size={14} strokeWidth={2.25} />
            </span>
          </a>
          <a href={phoneHref} className={styles.topBarPhone}>
            <Phone size={13} strokeWidth={2} className={styles.topBarPhoneIcon} />
            <span className={styles.topBarPhoneLabel}>For Bulk Order:</span>
            <span className={styles.topBarPhoneNumber}>{CONTACT.phone}</span>
          </a>
        </div>
      </div>

      <header className={styles.header}>
        <div className={styles.inner}>
          
          {/* ================= LEFT SECTION ================= */}
          <div className={styles.leftSection}>
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className={styles.hamburgerBtn}
              onClick={openMobileMenu}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            <Logo />
          </div>

          {/* ================= CENTER SECTION: nav links ================= */}
          <nav className={`${styles.centerSection} ${styles.desktopNav}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ================= RIGHT SECTION ================= */}
          <div className={styles.rightSection}>
            {/* Icon Actions */}
            <div className={styles.iconActions}>
              <Link href="/cart" className={styles.iconBtn} aria-label="Shopping Cart">
                <ShoppingCart size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className={styles.cartBadge}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
              <Link href={accountHref} className={styles.iconBtn} aria-label="My Account">
                <User size={20} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

        </div>
      </header>

      <CategoryNav />

      {/* ================= MOBILE DRAWER MENU ================= */}
      {(mobileMenuOpen || mobileMenuClosing) && (
        <div
          className={`${styles.drawerOverlay} ${mobileMenuClosing ? styles.drawerOverlayClosing : ''}`}
          onClick={closeMobileMenu}
        >
          <div
            className={`${styles.drawerContent} ${mobileMenuClosing ? styles.drawerContentClosing : ''}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.drawerHeader}>
              <Logo size="sm" onClick={closeMobileMenu} />
              <button
                type="button"
                className={styles.drawerCloseBtn}
                onClick={closeMobileMenu}
                aria-label="Close Navigation Menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className={styles.drawerNav}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.drawerNavLink} ${pathname === link.href ? styles.drawerNavLinkActive : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={16} className={styles.drawerLinkArrow} />
                </Link>
              ))}

              <div className={styles.drawerDivider} />

              <Link
                href="/faqs"
                className={styles.drawerSecondaryLink}
                onClick={closeMobileMenu}
              >
                FAQs & Support
              </Link>
              <Link
                href="/policy/privacy-policy"
                className={styles.drawerSecondaryLink}
                onClick={closeMobileMenu}
              >
                Privacy Policy
              </Link>
              <Link
                href="/policy/terms-and-conditions"
                className={styles.drawerSecondaryLink}
                onClick={closeMobileMenu}
              >
                Terms & Conditions
              </Link>
              <Link
                href="/policy/shipping-policy"
                className={styles.drawerSecondaryLink}
                onClick={closeMobileMenu}
              >
                Shipping Policy
              </Link>
              <Link
                href="/policy/refund-policy"
                className={styles.drawerSecondaryLink}
                onClick={closeMobileMenu}
              >
                Returns & Refunds
              </Link>

            </nav>

            <div className={styles.drawerFooter}>
              <SocialLinks
                items={['whatsapp', 'instagram', 'email', 'maps']}
                className={styles.drawerSocial}
              />
              <p>© {new Date().getFullYear()} ChairDekho. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
