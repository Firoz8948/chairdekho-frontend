/** Normalize dynamic `[slug]` route param before API calls (avoids double-encoding). */
export function normalizeRouteSlug(slug) {
  if (slug == null || slug === '') return '';
  let s = String(slug).trim();
  for (let i = 0; i < 3; i += 1) {
    if (!/%[0-9A-Fa-f]{2}/.test(s)) break;
    try {
      const decoded = decodeURIComponent(s);
      if (decoded === s) break;
      s = decoded;
    } catch {
      break;
    }
  }
  return s;
}

/** Path suffix for `GET /products/{slug}` (single encoding). */
export function productSlugApiPath(slug) {
  const normalized = normalizeRouteSlug(slug);
  if (!normalized) return '/products';
  return `/products/${encodeURIComponent(normalized)}`;
}
