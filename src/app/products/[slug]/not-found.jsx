import StorefrontNotFound from '@/components/StorefrontNotFound/StorefrontNotFound';
import { BRAND } from '@/lib/seo';

export const metadata = {
  title: { absolute: `Product not found | ${BRAND}` },
  robots: { index: false, follow: true },
};

export default function ProductNotFound() {
  return (
    <StorefrontNotFound
      title="Product not found"
      description="This product may have been renamed, is temporarily unavailable, or the link is out of date. Browse our shop to find chairs and tables for home, balcony, garden and café."
      primaryHref="/shop"
      primaryLabel="Go to shop"
    />
  );
}
