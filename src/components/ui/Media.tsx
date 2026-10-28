'use client';
import Image from 'next/image';
import { isUnsplash, unsplashLoader } from '@/lib/content/media';

/**
 * Image in a fixed aspect-ratio box, so nothing shifts while it loads.
 * Development photography is resized by Unsplash's CDN; Shopify photography
 * goes through next/image's optimiser. Local SVGs render as plain <img>.
 */
export function Media({
  src,
  alt,
  ratio = '4 / 5',
  sizes = '(min-width: 1024px) 33vw, 50vw',
  priority = false,
  className,
  fit = 'cover',
  focus,
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fit?: 'cover' | 'contain';
  focus?: string;
}) {
  const style = { objectFit: fit, objectPosition: focus } as const;
  return (
    <span className={`media ${className ?? ''}`} style={ratio === 'fill' ? undefined : { aspectRatio: ratio }}>
      {src.endsWith('.svg') ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" style={style} />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={style}
          loader={isUnsplash(src) ? unsplashLoader : undefined}
        />
      )}
    </span>
  );
}
