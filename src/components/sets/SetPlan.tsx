import type { RoomSetContent } from '@/lib/content/sets';
import { theTitle } from '@/lib/content/sets';

/**
 * A top-down plan of the set laid out, drawn like an architect's sketch:
 * the surface, each piece as a simple shape, and its name on a leader line.
 */
export function SetPlan({ set }: { set: RoomSetContent }) {
  const X0 = 30; // plan drawn in a 100 × 70 grid, offset to leave room for labels
  const cx = (s: { x: number; w: number }) => X0 + s.x + s.w / 2;
  const cy = (s: { y: number; h: number }) => s.y + s.h / 2;

  // Labels on the nearer side, spread so they never overlap.
  const placed = set.pieces.map((p) => ({ p, side: cx(p.plan) - X0 < 50 ? 'left' : 'right', y: cy(p.plan) }));
  for (const side of ['left', 'right']) {
    const group = placed.filter((l) => l.side === side).sort((a, b) => a.y - b.y);
    let last = -Infinity;
    for (const l of group) {
      l.y = Math.max(l.y, last + 8, 6);
      last = l.y;
    }
  }
  const surface = set.plan.surfaceShape;

  return (
    <figure className="set-plan">
      <svg viewBox="0 0 160 74" role="img" aria-label={`Plan of ${theTitle(set.title)} set laid out on a ${set.plan.surface.toLowerCase()}`}>
        <defs>
          <pattern id={`hatch-${set.handle}`} width="2.5" height="2.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="2.5" className="set-plan__hatch" />
          </pattern>
        </defs>
        <rect x={X0 + surface.x} y={surface.y} width={surface.w} height={surface.h} className="set-plan__surface" />
        <rect x={X0 + surface.x} y={surface.y} width={surface.w} height={surface.h} fill={`url(#hatch-${set.handle})`} />
        <text x={X0 + surface.x + 1.5} y={surface.y + surface.h - 2} className="set-plan__surface-label">
          {set.plan.surface}
        </text>
        {/* Flat pieces (cloths, trays, rugs) first, then larger before smaller, so things standing on others stay visible. */}
        {[...set.pieces].sort((x, y) => Number(x.plan.shape === 'circle') - Number(y.plan.shape === 'circle') || y.plan.w * y.plan.h - x.plan.w * x.plan.h).map(({ handle, plan }) =>
          plan.shape === 'circle' ? (
            <ellipse key={handle} cx={cx(plan)} cy={cy(plan)} rx={plan.w / 2} ry={plan.h / 2} className="set-plan__piece" />
          ) : (
            <rect key={handle} x={X0 + plan.x} y={plan.y} width={plan.w} height={plan.h} className="set-plan__piece" />
          ),
        )}
        {placed.map(({ p, side, y }) => {
          const tx = side === 'left' ? X0 - 3 : X0 + 103;
          return (
            <g key={p.handle} className="set-plan__label">
              <polyline points={`${cx(p.plan)},${cy(p.plan)} ${side === 'left' ? X0 + 1 : X0 + 99},${y} ${tx},${y}`} className="set-plan__leader" />
              <circle cx={cx(p.plan)} cy={cy(p.plan)} r="0.8" className="set-plan__dot" />
              <text x={side === 'left' ? tx - 1 : tx + 1} y={y + 1.2} textAnchor={side === 'left' ? 'end' : 'start'}>
                {p.role.replace(/^The /, '')}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{set.plan.note}</figcaption>
    </figure>
  );
}
