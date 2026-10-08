import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'FAQs | ChairDekho',
  description:
    'Answers to common questions about buying chairs from ChairDekho – orders, delivery in Vasai Virar, bulk orders, returns, payments and chair care.',
  path: '/faqs',
});

export default function FaqsLayout({ children }) {
  return children;
}
