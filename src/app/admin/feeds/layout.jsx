import { notFound } from 'next/navigation';
import { FEATURES } from '@/lib/features';

export default function AdminFeedsLayout({ children }) {
  if (!FEATURES.watchAndShop) notFound();
  return children;
}
