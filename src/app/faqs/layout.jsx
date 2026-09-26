import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FAQs | Lansdowne Leather',
  description:
    'Answers to common questions about Lansdowne Leather genuine leather wallets, bags and belts — orders, shipping, returns, payments and leather care.',
  path: '/faqs',
});

export default function FaqsLayout({ children }) {
  return children;
}
