'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import productService from '@/lib/services/products';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '../shop.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
];

const formatPrice = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function ShopScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categorySlug, setCategorySlug] = useState(
    searchParams.get('category') || ''
  );
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    const fromUrl = searchParams.get('category') || '';
    const sortFromUrl = searchParams.get('sort') || 'newest';
    setCategorySlug(fromUrl);
    setSort(sortFromUrl);
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;
    productService
      .getCategories()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data.filter((c) => c.is_active !== false && !c.is_reels)
          : [];
        setCategories(list);
      })
      .catch(() => {
        if (mounted) setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const syncUrl = useCallback(
    (nextCategory, nextSort) => {
      const params = new URLSearchParams();
      if (nextCategory) params.set('category', nextCategory);
      if (nextSort && nextSort !== 'newest') params.set('sort', nextSort);
      const qs = params.toString();
      router.replace(qs ? `/shop?${qs}` : '/shop', { scroll: false });
    },
    [router]
  );

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({
        page: 1,
        page_size: 48,
        category_slug: categorySlug || undefined,
        sort: sort || 'newest',
      });
      const items = Array.isArray(data?.items) ? data.items : [];
      setProducts(items);
      setTotal(data?.total ?? items.length);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to load products');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const selectedCategoryName = useMemo(() => {
    if (!categorySlug) return 'All Products';
    return categories.find((c) => c.slug === categorySlug)?.name || 'Shop';
  }, [categories, categorySlug]);

  const handleSortChange = (value) => {
    setSort(value);
    syncUrl(categorySlug, value);
  };

  const handleAddToBag = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, { quantity: 1 });
    toast.success(`${product.name} added to cart`);
    router.push('/cart');
  };

  const clearFilters = () => {
    setCategorySlug('');
    setSort('newest');
    syncUrl('', 'newest');
  };

  const renderProductCard = (product) => (
    <ProductCard
      key={product.id}
      product={product}
      styles={styles}
      formatPrice={formatPrice}
      onAddToBag={handleAddToBag}
    />
  );

  return (
    <div className={styles.shopContent}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeading}>
          <h1 className={styles.sectionTitle}>SHOP</h1>
          <p className={styles.sectionSubtitle}>
            {selectedCategoryName}
            {!loading && (
              <span className={styles.resultCount}>
                {' '}
                · {total} item{total === 1 ? '' : 's'}
              </span>
            )}
          </p>
        </div>

        <label className={styles.sortControl}>
          <SlidersHorizontal size={15} aria-hidden="true" />
          <span className={styles.sortLabel}>Sort</span>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className={styles.sortChevron} aria-hidden="true" />
        </label>
      </div>

      <div className={styles.layout}>
        <section className={styles.productsArea}>
          {loading ? (
            <div className={styles.productGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className={`${styles.productCard} ${styles.productSkeleton}`} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>No products found</h2>
              <p>Try another category.</p>
              <button type="button" className={styles.clearBtn} onClick={clearFilters}>
                Show all products
              </button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {products.map(renderProductCard)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
