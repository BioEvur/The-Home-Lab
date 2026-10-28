'use client';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/lib/content/media';
import { photoUrl } from '@/lib/content/media';
import { Media } from '@/components/ui/Media';

/**
 * The story in three beats. On wide screens the photograph stays pinned while
 * the words scroll past, and it changes with each beat. On phones each beat
 * has its photograph above it.
 */
export function StoryBeats({ beats }: { beats: { text: string; photo: Photo }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="story">
      <div className="story__stage" aria-hidden="true">
        {beats.map((b, i) => (
          <Media
            key={b.photo.id}
            src={photoUrl(b.photo.id, 1600)}
            alt=""
            ratio="fill"
            sizes="50vw"
            className={`story__frame ${i === active ? 'is-active' : ''}`}
          />
        ))}
      </div>
      <ol className="story__beats">
        {beats.map((b, i) => (
          <li
            key={b.photo.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className={`story__beat ${i === active ? 'is-active' : ''}`}
          >
            <Media src={photoUrl(b.photo.id, 1000)} alt={b.photo.alt} ratio="4 / 5" sizes="100vw" className="story__inline" />
            <p>{b.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
