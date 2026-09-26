import { SITE_URL, fetchApi } from '@/lib/seo';

export const revalidate = 3600;

const STATIC_PAGES = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/shop', changeFrequency: 'daily', priority: 0.9 },
  { path: '/watch-and-shop', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/faqs', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/contact-us', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/policy/shipping-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/policy/refund-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/policy/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/policy/terms-and-conditions', changeFrequency: 'yearly', priority: 0.2 },
];

const MAX_PRODUCT_PAGES = 50;

async function fetchAllProducts() {
  const products = [];
  for (let page = 1; page <= MAX_PRODUCT_PAGES; page += 1) {
    const res = await fetchApi(`/products/?page=${page}&page_size=100`, { revalidate });
    const items = Array.isArray(res.data?.items) ? res.data.items : [];
    products.push(...items);
    const totalPages = Number(res.data?.total_pages) || 1;
    if (!res.ok || !items.length || page >= totalPages) break;
  }
  return products;
}

const toDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
};

export default async function sitemap() {
  const now = new Date();
  const [products, categoriesRes] = await Promise.all([
    fetchAllProducts(),
    fetchApi('/categories/', { revalidate }),
  ]);
  const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];

  const staticEntries = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path === '/' ? '' : page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const categoryEntries = categories
    .filter((c) => c?.slug && !c.is_reels && c.is_active !== false)
    .map((c) => ({
      url: `${SITE_URL}/shop?category=${encodeURIComponent(c.slug)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const productEntries = products
    .filter((p) => p?.slug && p.is_active !== false)
    .map((p) => ({
      url: `${SITE_URL}/products/${encodeURIComponent(p.slug)}`,
      lastModified: toDate(p.updated_at) || now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
