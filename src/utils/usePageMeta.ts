import { useEffect } from 'react';

const SITE = 'https://www.londonpost.news';

type PageMeta = { title: string; description: string; path: string };

export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;

    const descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = descEl?.getAttribute('content') ?? null;
    let createdDesc: HTMLMetaElement | null = null;

    document.title = title;

    if (descEl) {
      descEl.setAttribute('content', description);
    } else {
      createdDesc = document.createElement('meta');
      createdDesc.name = 'description';
      createdDesc.content = description;
      document.head.appendChild(createdDesc);
    }

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = SITE + path;
    canonical.setAttribute('data-page-meta', 'true');
    document.head.appendChild(canonical);

    return () => {
      document.title = prevTitle;
      if (descEl && prevDesc !== null) descEl.setAttribute('content', prevDesc);
      if (createdDesc) createdDesc.remove();
      canonical.remove();
    };
  }, [title, description, path]);
}
