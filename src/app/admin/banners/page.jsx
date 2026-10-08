'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ImagePlus, Monitor, Smartphone, Plus, Trash2, X, RefreshCw, ExternalLink, ArrowUp, ArrowDown } from 'lucide-react';
import adminService from '@/lib/services/admin';
import { BANNER_SIZES, resolveBannerUrl } from '@/lib/banners';
import styles from '../products/products.module.css';
import bannerStyles from './banners.module.css';

const DEVICES = [
  { id: 'desktop', icon: Monitor },
  { id: 'mobile', icon: Smartphone },
];

const emptyForm = { title: '', link_url: '', is_active: true };

const readImageSize = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

export default function BannersPage() {
  const [device, setDevice] = useState('desktop');
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fileSize, setFileSize] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);

  const size = BANNER_SIZES[device];
  const ratio = `${size.width} / ${size.height}`;

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getBanners(device);
      setBanners(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  }, [device]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setPreview('');
    setFileSize(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const switchDevice = (next) => {
    if (next === device) return;
    resetForm();
    setDevice(next);
  };

  const handleFileChange = async (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setFileSize(await readImageSize(picked));
  };

  const sizeMatches =
    fileSize &&
    Math.abs(fileSize.width / fileSize.height - size.width / size.height) < 0.02;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Choose a banner image first');
      return;
    }

    const nextPosition = banners.reduce((max, b) => Math.max(max, b.position ?? 0), -1) + 1;
    let created = null;
    try {
      setSubmitting(true);
      created = await adminService.createBanner({
        device,
        title: form.title.trim() || null,
        link_url: form.link_url.trim() || null,
        position: nextPosition,
        is_active: Boolean(form.is_active),
      });
      await adminService.uploadBannerImage(created.id, file);
      toast.success(`${size.label} banner added`);
      resetForm();
      fetchBanners();
    } catch (err) {
      if (created?.id) {
        await adminService.deleteBanner(created.id).catch(() => {});
      }
      toast.error(err.message || 'Failed to upload banner');
    } finally {
      setSubmitting(false);
    }
  };

  const updateBanner = async (banner, data, successMsg) => {
    try {
      setBusyId(banner.id);
      await adminService.updateBanner(banner.id, data);
      if (successMsg) toast.success(successMsg);
      fetchBanners();
    } catch (err) {
      toast.error(err.message || 'Failed to update banner');
    } finally {
      setBusyId(null);
    }
  };

  const replaceImage = async (banner, picked) => {
    if (!picked) return;
    try {
      setBusyId(banner.id);
      await adminService.uploadBannerImage(banner.id, picked);
      toast.success('Banner image replaced');
      fetchBanners();
    } catch (err) {
      toast.error(err.message || 'Failed to replace image');
    } finally {
      setBusyId(null);
    }
  };

  const moveBanner = async (banner, direction) => {
    const ordered = [...banners];
    const from = ordered.findIndex((b) => b.id === banner.id);
    const to = from + direction;
    if (to < 0 || to >= ordered.length) return;
    [ordered[from], ordered[to]] = [ordered[to], ordered[from]];
    try {
      setBusyId(banner.id);
      await Promise.all(
        ordered.map((b, i) =>
          b.position === i ? null : adminService.updateBanner(b.id, { position: i })
        )
      );
      fetchBanners();
    } catch (err) {
      toast.error(err.message || 'Failed to reorder banners');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminService.deleteBanner(deleteTarget.id);
      toast.success('Banner deleted');
      setDeleteTarget(null);
      fetchBanners();
    } catch (err) {
      toast.error(err.message || 'Failed to delete banner');
    } finally {
      setDeleting(false);
    }
  };

  const activeCount = banners.filter((b) => b.is_active && b.image_url).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Home Banners</h1>
          <p className={styles.subtitle}>
            Slides shown at the top of the home page. Desktop: {BANNER_SIZES.desktop.width} ×{' '}
            {BANNER_SIZES.desktop.height} px · Mobile: {BANNER_SIZES.mobile.width} ×{' '}
            {BANNER_SIZES.mobile.height} px.
          </p>
        </div>
      </div>

      <div className={bannerStyles.tabs} role="tablist">
        {DEVICES.map(({ id, icon: TabIcon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={device === id}
            className={`${bannerStyles.tab} ${device === id ? bannerStyles.tabActive : ''}`}
            onClick={() => switchDevice(id)}
          >
            <TabIcon size={16} />
            {BANNER_SIZES[id].label}
            <span className={bannerStyles.tabSize}>
              {BANNER_SIZES[id].width} × {BANNER_SIZES[id].height}
            </span>
          </button>
        ))}
      </div>

      <form className={styles.formSection} onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <h2 className={styles.sectionTitle}>Add {size.label.toLowerCase()} banner</h2>
        <p className={styles.sectionHint}>
          Upload a {size.width} × {size.height} px image (JPG, PNG or WebP). Other sizes are
          cropped to fit, so keep text and products away from the edges.
        </p>

        <div className={bannerStyles.uploadRow}>
          <label
            className={`${styles.imageDropzone} ${bannerStyles.dropzone}`}
            style={{ aspectRatio: ratio }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              hidden
            />
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Selected banner preview" className={bannerStyles.dropPreview} />
            ) : (
              <div className={bannerStyles.dropEmpty}>
                <ImagePlus size={32} className={styles.imageDropIcon} />
                <div className={styles.imageDropTitle}>Click to choose banner image</div>
                <div className={styles.imageDropHint}>
                  {size.width} × {size.height} px recommended
                </div>
              </div>
            )}
          </label>

          <div className={bannerStyles.uploadFields}>
            {fileSize && (
              <p className={sizeMatches ? bannerStyles.sizeOk : bannerStyles.sizeWarn}>
                Selected image: {fileSize.width} × {fileSize.height} px
                {sizeMatches ? ' — perfect fit.' : ` — will be cropped to ${size.width} × ${size.height}.`}
              </p>
            )}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Title / alt text (optional)</label>
              <input
                className={styles.formInput}
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Plastic chairs sale – up to 30% off"
              />
              <span className={styles.formHint}>Not shown on the banner; used for SEO and screen readers.</span>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Link (optional)</label>
              <input
                className={styles.formInput}
                value={form.link_url}
                onChange={(e) => setForm((p) => ({ ...p, link_url: e.target.value }))}
                placeholder="/shop or https://…"
              />
              <span className={styles.formHint}>Where customers go when they tap the banner.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                />
                Show on website immediately
              </label>
              <button type="submit" className={styles.addBtn} disabled={submitting || !file}>
                <Plus size={18} />
                {submitting ? 'Uploading…' : 'Add Banner'}
              </button>
              {file && !submitting && (
                <button type="button" className={styles.secondaryBtn} onClick={resetForm}>
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className={styles.tableCard}>
        <div className={bannerStyles.listHeader}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
            {size.label} banners
          </h2>
          <span className={styles.statPill}>
            {activeCount} live · {banners.length} total
          </span>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading banners…</div>
        ) : banners.length === 0 ? (
          <div className={styles.emptyState}>
            <ImagePlus size={40} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No {size.label.toLowerCase()} banners yet</h3>
            <p className={styles.emptyDesc}>
              The home page shows a {size.width} × {size.height} placeholder until you add one.
            </p>
          </div>
        ) : (
          <div className={bannerStyles.grid}>
            {banners.map((banner, i) => {
              const busy = busyId === banner.id;
              return (
                <div key={banner.id} className={bannerStyles.card} aria-busy={busy}>
                  <div className={bannerStyles.cardPreview} style={{ aspectRatio: ratio }}>
                    {banner.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveBannerUrl(banner.image_url)} alt={banner.title || 'Banner'} />
                    ) : (
                      <span className={bannerStyles.noImage}>No image</span>
                    )}
                    <span className={bannerStyles.positionBadge}>#{i + 1}</span>
                  </div>

                  <div className={bannerStyles.cardBody}>
                    <div className={bannerStyles.cardTitle}>{banner.title || 'Untitled banner'}</div>
                    {banner.link_url ? (
                      <a
                        href={banner.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={bannerStyles.cardLink}
                      >
                        <ExternalLink size={12} /> {banner.link_url}
                      </a>
                    ) : (
                      <span className={bannerStyles.cardMuted}>No link</span>
                    )}

                    <div className={bannerStyles.cardActions}>
                      <button
                        type="button"
                        className={`${styles.badge} ${banner.is_active ? styles.badgeActive : styles.badgeInactive}`}
                        onClick={() =>
                          updateBanner(
                            banner,
                            { is_active: !banner.is_active },
                            banner.is_active ? 'Banner hidden' : 'Banner is live'
                          )
                        }
                        disabled={busy}
                      >
                        {banner.is_active ? 'Live' : 'Hidden'}
                      </button>

                      <div className={styles.actionsCell}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => moveBanner(banner, -1)}
                          disabled={busy || i === 0}
                          aria-label="Move banner earlier"
                          title="Move earlier"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          onClick={() => moveBanner(banner, 1)}
                          disabled={busy || i === banners.length - 1}
                          aria-label="Move banner later"
                          title="Move later"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <label className={styles.actionBtn} title="Replace image" aria-label="Replace image">
                          <RefreshCw size={14} />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            hidden
                            disabled={busy}
                            onChange={(e) => {
                              replaceImage(banner, e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => setDeleteTarget(banner)}
                          disabled={busy}
                          aria-label="Delete banner"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete banner?</h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              Delete <strong>{deleteTarget.title || 'this banner'}</strong>? It will be removed from
              the home page. This cannot be undone.
            </div>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
