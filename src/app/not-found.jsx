import StorefrontNotFound from '@/components/StorefrontNotFound/StorefrontNotFound';
import { BRAND } from '@/lib/seo';

export const metadata = {
  title: { absolute: `Page not found | ${BRAND}` },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <StorefrontNotFound
      title="Page not found"
      description="The link may be broken or the page may have been removed. Explore our shop for plastic, dining, garden and office chairs."
    />
  );
}
