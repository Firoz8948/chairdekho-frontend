import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Watch & Shop | Lansdowne Leather',
  description:
    'Watch short videos of our genuine leather wallets, handbags, sling bags and belts for men and women, and shop your favourites instantly.',
  path: '/watch-and-shop',
});

export default function WatchAndShopLayout({ children }) {
  return children;
}
