import './globals.css';
import { Toaster } from 'react-hot-toast';
import { fontSans, fontVariables } from '@/lib/fonts';
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

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${BRAND}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: BRAND,
  keywords: SITE_KEYWORDS,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
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
    <html lang="en-IN" className={fontVariables}>
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
