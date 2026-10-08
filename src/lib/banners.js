export const BANNER_SIZES = {
  desktop: { width: 2048, height: 768, label: 'Desktop' },
  mobile: { width: 1080, height: 405, label: 'Mobile' },
};

export const resolveBannerUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};
