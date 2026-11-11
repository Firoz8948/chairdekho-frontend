export function chairCode(product) {
  if (product?.catalogue_code) return product.catalogue_code;
  const n = product?.catalogue_number;
  if (n != null && n !== '') {
    return `CHAIRDEKHO-${String(n).padStart(2, '0')}`;
  }
  return 'CHAIRDEKHO-—';
}

export function formatCataloguePrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return `₹${num.toLocaleString('en-IN')}`;
}

export function catalogueDisplayPrice(product) {
  return product?.display_price ?? product?.catalogue_price ?? product?.price;
}
