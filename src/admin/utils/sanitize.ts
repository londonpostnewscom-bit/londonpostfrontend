const ALLOWED_TAGS = ['p','b','strong','i','em','u','h2','h3','ul','ol','li','br','blockquote','a'];

export function sanitizeHtml(dirty: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  function clean(node: Node): Node | null {
    // Text nodes — keep as-is
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    // Remove script, style, iframe, img (unless you want images)
    if (['script','style','iframe','object','embed','form','input','button','meta','link'].includes(tag)) {
      return null;
    }

    // If tag not allowed, replace with a div but keep children
    const newTag = ALLOWED_TAGS.includes(tag) ? tag : 'p';
    const newEl = document.createElement(newTag);

    // Only keep href on <a>
    if (tag === 'a') {
      const href = el.getAttribute('href');
      if (href) newEl.setAttribute('href', href);
      newEl.setAttribute('target', '_blank');
      newEl.setAttribute('rel', 'noopener noreferrer');
    }

    // Recurse children
    el.childNodes.forEach((child) => {
      const cleaned = clean(child);
      if (cleaned) newEl.appendChild(cleaned);
    });

    // Don't return empty block elements
    if (['p','h2','h3','li'].includes(newTag) && !newEl.textContent?.trim()) {
      return null;
    }

    return newEl;
  }

  const result = document.createElement('div');
  doc.body.childNodes.forEach((child) => {
    const cleaned = clean(child);
    if (cleaned) result.appendChild(cleaned);
  });

  return result.innerHTML;
}