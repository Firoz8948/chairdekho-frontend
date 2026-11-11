'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import catalogueService from '@/lib/services/catalogue';
import productService from '@/lib/services/products';
import productStyles from '../products/products.module.css';
import styles from './catalogueAdmin.module.css';

const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const PAGE_SIZE = 10;

export default function AdminCataloguePage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await catalogueService.getAdminCatalogue({
        page,
        page_size: PAGE_SIZE,
        category_id: categoryId ? Number(categoryId) : null,
      });
      const items = Array.isArray(data?.items) ? data.items : [];
      setRows(items);
      setTotalPages(data?.total_pages || 1);
      const nextDraft = {};
      items.forEach((row) => {
        nextDraft[row.id] = {
          catalogue_number: row.catalogue_number ?? '',
          catalogue_price: row.catalogue_price ?? '',
        };
      });
      setDraft(nextDraft);
    } catch (err) {
      toast.error(err.message || 'Failed to load catalogue');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, categoryId]);

  useEffect(() => {
    productService
      .getCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data.filter((c) => c.is_active !== false && !c.is_reels) : [];
        setCategories(list);
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateDraft = (id, key, value) => {
    setDraft((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const payload = useMemo(
    () =>
      rows.map((row) => {
        const d = draft[row.id] || {};
        const numRaw = d.catalogue_number;
        const priceRaw = d.catalogue_price;
        return {
          id: row.id,
          catalogue_number:
            numRaw === '' || numRaw == null ? null : Math.min(99, Math.max(1, parseInt(numRaw, 10) || null)),
          catalogue_price:
            priceRaw === '' || priceRaw == null ? null : Number(priceRaw),
        };
      }),
    [rows, draft]
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      await catalogueService.saveAdminCatalogue(payload);
      toast.success('Catalogue updated');
      load();
    } catch (err) {
      toast.error(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={productStyles.container}>
      <div className={productStyles.header}>
        <div>
          <h1 className={productStyles.title}>
            <BookOpen size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Catalogue
          </h1>
          <p className={productStyles.subtitle}>
            Catalogue-only chair numbers and prices (does not change shop PDP prices).
          </p>
        </div>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving || loading || !rows.length}
        >
          {saving ? 'Saving…' : 'Save page'}
        </button>
      </div>

      <div className={styles.wrap}>
        <div className={styles.toolbar}>
          <div className={styles.filterRow}>
            <label htmlFor="cat-filter">Category</label>
            <select
              id="cat-filter"
              className={styles.select}
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All products</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Product title</th>
                <th>Images</th>
                <th>Chair no.</th>
                <th>Catalogue price</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5}>No products found.</td>
                </tr>
              ) : (
                rows.map((row) => {
                  const main = resolveImageUrl(row.images?.[0]);
                  const rest = (row.images || []).slice(1, 8).map(resolveImageUrl).filter(Boolean);
                  const d = draft[row.id] || {};
                  return (
                    <tr key={row.id}>
                      <td>{row.serial}</td>
                      <td className={styles.titleCell}>{row.name}</td>
                      <td>
                        <div className={styles.imagesCell}>
                          {main ? (
                            <img src={main} alt="" className={styles.mainImg} />
                          ) : (
                            <span className={styles.hint}>No image</span>
                          )}
                          {rest.length > 0 ? (
                            <div className={styles.thumbRow}>
                              {rest.map((src) => (
                                <img key={src} src={src} alt="" className={styles.thumb} />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          max={99}
                          className={styles.input}
                          value={d.catalogue_number ?? ''}
                          onChange={(e) => updateDraft(row.id, 'catalogue_number', e.target.value)}
                          placeholder="01–99"
                        />
                        <div className={styles.hint}>CHAIRDEKHO-##</div>
                      </td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          step="1"
                          className={styles.input}
                          value={d.catalogue_price ?? ''}
                          onChange={(e) => updateDraft(row.id, 'catalogue_price', e.target.value)}
                          placeholder={String(row.price)}
                        />
                        <div className={styles.priceNote}>Shop price ₹{row.price}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} style={{ verticalAlign: 'middle' }} /> Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ChevronRight size={16} style={{ verticalAlign: 'middle' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
