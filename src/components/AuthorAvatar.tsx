import { useAuthorPhotos, AuthorEntry } from '../hooks/useAuthorPhotos';

// Shared avatar component — used on the homepage Opinion preview AND the
// full Opinion page, so a given author's photo (or lack of one) looks
// identical everywhere. Falls back to a clean initials circle when no
// photo is on file, never a broken image.
export function AuthorAvatar({
  name,
  size = 'md',
  showBadge = true,
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}) {
  const { get } = useAuthorPhotos();
  const entry: AuthorEntry | null = get(name);

  const dims = size === 'lg' ? 'h-16 w-16' : size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  const textSize = size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-sm';

  if (entry?.photoUrl) {
    return (
      <div className={`relative flex-shrink-0 ${dims}`}>
        <img
          src={entry.photoUrl}
          alt={name}
          className={`h-full w-full rounded-full object-cover ring-2 ${entry.isTeamMember ? 'ring-accent/40' : 'ring-slate-200'}`}
        />
        {showBadge && entry.isTeamMember && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white ring-2 ring-white">
            <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 font-bold text-white ${dims} ${textSize}`}>
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
}
