import Link from 'next/link';
import type { ContentPage as Page } from '@/lib/content/policies';
import { Icon } from '@/components/ui/Icon';
import { ToConfirm } from '@/components/ui/DevNote';

/** Renders text, turning [[...]] into visible "To confirm" markers. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[.+?\]\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[[') ? <ToConfirm key={i}>{part.slice(2, -2)}</ToConfirm> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

export function DraftBanner() {
  return (
    <div className="draft-banner" role="note">
      <Icon name="alert" size={18} />
      <p>
        <strong>Draft for review.</strong> Highlighted items are business or legal details that have not been confirmed. This page must be completed and reviewed
        before launch.
      </p>
    </div>
  );
}

export function ContentBody({ page }: { page: Page }) {
  return (
    <div className="prose">
      {page.draft && <DraftBanner />}
      {page.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.body.map((b, i) =>
            typeof b === 'string' ? (
              <p key={i}>
                <RichText text={b} />
              </p>
            ) : (
              <ul key={i}>
                {b.list.map((li) => (
                  <li key={li}>
                    <RichText text={li} />
                  </li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}
      <p className="content-contact">
        Still need help? <Link href="/contact">Contact us</Link>.
      </p>
    </div>
  );
}
