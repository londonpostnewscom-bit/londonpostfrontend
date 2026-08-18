import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export type AuthorEntry = { photoUrl: string; isTeamMember: boolean };
type AuthorsMap = Record<string, AuthorEntry>;

let authorsCache: AuthorsMap | null = null;
let inFlight: Promise<void> | null = null;

function normalizeKey(name: string) {
  return (name || '').trim().toLowerCase();
}

async function loadAuthors(): Promise<void> {
  if (authorsCache) return;
  if (inFlight) return inFlight;

  inFlight = fetch(`${API_URL}/authors`)
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => {
      const map: AuthorsMap = {};
      (Array.isArray(data) ? data : []).forEach((a: any) => {
        map[normalizeKey(a.name)] = { photoUrl: a.photoUrl || '', isTeamMember: !!a.isTeamMember };
      });
      authorsCache = map;
    })
    .catch(() => {
      authorsCache = {};
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

// Returns { ready, get } — get(name) does a synchronous lookup once ready
// is true. Before that, get() returns null for everyone (renders fall back
// to initials, which then update once the fetch resolves).
export function useAuthorPhotos() {
  const [ready, setReady] = useState(authorsCache !== null);

  useEffect(() => {
    if (authorsCache !== null) return;
    loadAuthors().then(() => setReady(true));
  }, []);

  const get = (name: string): AuthorEntry | null => {
    if (!authorsCache) return null;
    return authorsCache[normalizeKey(name)] || null;
  };

  return { ready, get };
}
