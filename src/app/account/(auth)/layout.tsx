import { Media } from '@/components/ui/Media';
import { SCENES, photoUrl } from '@/lib/content/media';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { FormStatus } from '@/components/forms/Field';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      <div className="auth-layout__media">
        <Media src={photoUrl(SCENES.readingCorner.id, 1400)} alt="" ratio="4 / 5" sizes="(min-width: 1024px) 45vw, 0px" />
      </div>
      <div className="auth-layout__body">
        {!isSupabaseConfigured() && (
          <FormStatus tone="info">
            Development build: customer accounts are not connected yet. Forms validate your input but do not create accounts or sign you in.
          </FormStatus>
        )}
        {children}
      </div>
    </div>
  );
}
