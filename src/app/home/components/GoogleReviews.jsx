import { ExternalLink, PenLine } from 'lucide-react';
import { CONTACT, fetchApi } from '@/lib/seo';
import homeStyles from '../home.module.css';
import styles from './googleReviews.module.css';

function GoogleLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Stars({ rating, size = 'md' }) {
  const pct = Math.max(0, Math.min(100, (Number(rating) / 5) * 100));
  return (
    <span
      className={`${styles.stars} ${size === 'lg' ? styles.starsLg : ''}`}
      role="img"
      aria-label={`${Number(rating).toFixed(1)} out of 5 stars`}
    >
      <span className={styles.starsBase}>★★★★★</span>
      <span className={styles.starsFill} style={{ width: `${pct}%` }}>
        ★★★★★
      </span>
    </span>
  );
}

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default async function GoogleReviews() {
  const { data } = await fetchApi('/reviews/google', { revalidate: 3600 });
  const rating = data?.rating ?? null;
  const count = data?.review_count ?? null;
  const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
  // A Maps listing has its own "Write a review" button, so it is a safe fallback
  const reviewUrl = data?.review_url || CONTACT.mapsUrl;
  const mapsUrl = data?.maps_url || CONTACT.mapsUrl;
  const hasRating = rating != null && count != null;

  return (
    <section className={`${homeStyles.section} ${styles.section}`}>
      <div className={homeStyles.sectionHeader}>
        <h2 className={homeStyles.sectionTitle}>GOOGLE REVIEWS</h2>
        <p className={homeStyles.sectionSubtitle}>
          {hasRating
            ? `Rated ${Number(rating).toFixed(1)} by ${count} customers on Google`
            : 'Shopped with us? Share your experience on Google'}
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.summary}>
          <GoogleLogo className={styles.summaryLogo} />
          {hasRating ? (
            <>
              <div className={styles.score}>{Number(rating).toFixed(1)}</div>
              <Stars rating={rating} size="lg" />
              <p className={styles.basedOn}>Based on {count} Google reviews</p>
            </>
          ) : (
            <p className={styles.basedOn}>
              Your review helps other families and businesses in Vasai-Virar find the right
              chairs.
            </p>
          )}
          <div className={styles.actions}>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <PenLine size={16} aria-hidden="true" /> Write a Review
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              See All Reviews <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        {reviews.length > 0 && (
          <ul className={styles.rail}>
            {reviews.map((review, index) => {
              const author = review.author_url ? (
                <a href={review.author_url} target="_blank" rel="noopener noreferrer">
                  {review.author}
                </a>
              ) : (
                review.author
              );
              return (
                <li key={`${review.author}-${review.published_at || index}`} className={styles.card}>
                  <div className={styles.cardHead}>
                    {review.author_photo ? (
                      <img
                        src={review.author_photo}
                        alt=""
                        className={styles.avatar}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className={`${styles.avatar} ${styles.avatarFallback}`}>
                        {initials(review.author)}
                      </span>
                    )}
                    <div className={styles.cardMeta}>
                      <span className={styles.author}>{author}</span>
                      {review.relative_time && (
                        <span className={styles.time}>{review.relative_time}</span>
                      )}
                    </div>
                    <GoogleLogo className={styles.cardLogo} />
                  </div>
                  {review.rating != null && <Stars rating={review.rating} />}
                  <p className={styles.text}>{review.text}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
