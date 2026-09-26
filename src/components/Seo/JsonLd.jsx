import { jsonLdString } from '@/lib/seo';

export default function JsonLd({ data }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!items.length) return null;
  return items.map((item, index) => (
    <script
      key={item['@type'] ? `${item['@type']}-${index}` : index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(item) }}
    />
  ));
}
