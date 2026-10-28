export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="container section--sm" aria-busy="true">
      <span className="visually-hidden">Loading products…</span>
      <div className="skeleton skeleton--title" />
      <ul className="product-grid product-grid--four">
        {Array.from({ length: count }, (_, i) => (
          <li key={i}>
            <div className="skeleton" style={{ aspectRatio: '4 / 5' }} />
            <div className="skeleton skeleton--line" />
          </li>
        ))}
      </ul>
    </div>
  );
}
