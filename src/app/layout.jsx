import './globals.css';
import { Plus_Jakarta_Sans, Arapey } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';
import JsonLd from '@/components/Seo/JsonLd';
import {
  BRAND,
  DEFAULT_OG_IMAGE,
  HOME_DESCRIPTION,
  HOME_TITLE,
  SITE_KEYWORDS,
  SITE_URL,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from '@/lib/seo';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const fontHeading = Arapey({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${BRAND}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: BRAND,
  keywords: SITE_KEYWORDS,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: BRAND,
    locale: 'en_IN',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${fontSans.variable} ${fontHeading.variable}`}>
      <body className={fontSans.className}>
        <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
