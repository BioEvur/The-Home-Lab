import Link from 'next/link';
import { ROOM_SETS } from '@/lib/content/sets';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <div className="container status-page">
      <p className="status-page__code" aria-hidden="true">
        404
      </p>
      <h1 className="h1">This page could not be found.</h1>
      <p className="lead">It may have moved, or the link may be out of date. The room sets are all here:</p>
      <ul className="chip-list">
        {ROOM_SETS.map((s) => (
          <li key={s.handle}>
            <Link href={`/sets/${s.handle}`} className="chip">
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="arrow-link">
        Back to the homepage <Icon name="arrow-right" size={16} />
      </Link>
    </div>
  );
}
