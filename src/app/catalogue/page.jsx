import { pageMetadata } from '@/lib/seo';
import CatalogueScreen from './components/CatalogueScreen';

export const metadata = pageMetadata({
  title: 'Product Catalogue | ChairDekho – Chairs in Vasai Virar',
  description:
    'Browse ChairDekho’s printable-style catalogue: chairs and tables by category with catalogue pricing, chair codes and order links.',
  path: '/catalogue',
});

export default function CataloguePage() {
  return <CatalogueScreen />;
}
