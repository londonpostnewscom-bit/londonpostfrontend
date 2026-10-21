import { useEffect } from 'react';

const SITE = 'https://www.londonpost.news';

type PageMeta = { title: string; description: string; path: string };

export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let descEl = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const descCreated = !descEl;
    const prevDesc = descEl?.getAttribute('content') ?? '';
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.name = 'description';
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', description);

    let linkEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const linkCreated = !linkEl;
    const prevHref = linkEl?.getAttribute('href') ?? '';
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.rel = 'canonical';
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', SITE + path);

    return () => {
      document.title = prevTitle;
      if (descCreated) descEl!.remove();
      else descEl!.setAttribute('content', prevDesc);
      if (linkCreated) linkEl!.remove();
      else linkEl!.setAttribute('href', prevHref);
    };
  }, [title, description, path]);
}
