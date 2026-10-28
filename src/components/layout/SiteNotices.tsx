import { isDevelopmentStage, siteConfig } from '@/lib/config/site';

/** Announcement strip only renders when a real message is configured. */
export function AnnouncementBar() {
  if (!siteConfig.announcement) return null;
  return <div className="announcement">{siteConfig.announcement}</div>;
}

/** Makes the development status of products, prices and images explicit. */
export function DevelopmentNotice({ mode }: { mode: 'development' | 'shopify' }) {
  if (!isDevelopmentStage) return null;
  return (
    <aside className="dev-notice" aria-label="Preview status">
      <span className="dev-notice__dot" aria-hidden="true" />
      {mode === 'development' ? (
        <span>
          <strong>Preview.</strong> Sample products, prices and stock photography. Nothing can be ordered yet.
        </span>
      ) : (
        <span>
          <strong>Staging.</strong> Connected to Shopify. Check content before launch.
        </span>
      )}
    </aside>
  );
}
