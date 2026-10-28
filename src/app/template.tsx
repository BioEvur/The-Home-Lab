/**
 * Route entrance: a short opacity and lift on each navigation. Pure CSS, so
 * it never delays rendering, and it is disabled under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
