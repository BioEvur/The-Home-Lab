'use client';
import { useEffect, useState } from 'react';

/** The time right now in the set's place, e.g. "07:42 in Kyoto". Filled in after load. */
export function LocalTime({ timeZone, place, className }: { timeZone: string; place: string; className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className={className}>
      <span className="local-time__value" suppressHydrationWarning>
        {time ?? '--:--'}
      </span>{' '}
      in {place}
    </span>
  );
}
