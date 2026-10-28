import { HelpNav } from '@/components/editorial/HelpNav';

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container help section--sm">
      <div className="help__layout">
        <HelpNav />
        <div className="help__content">{children}</div>
      </div>
    </div>
  );
}
