import { notFound } from 'next/navigation';
import { FEATURES } from '@/lib/features';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Watch & Shop | ChairDekho',
  description:
    'Watch short videos of our plastic, dining, garden, office and kids chairs, and shop your favourite chairs instantly at affordable prices.',
  path: '/watch-and-shop',
});

export default function WatchAndShopLayout({ children }) {
  if (!FEATURES.watchAndShop) notFound();
  return children;
}
