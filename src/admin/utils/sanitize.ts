const ALLOWED_TAGS = ['p', 'b', 'strong', 'i', 'em', 'u', 'h2', 'h3', 'ul', 'ol', 'li', 'br', 'blockquote', 'a', 'img', 'figure', 'figcaption'];
const BLOCK_TAGS = ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'div']; // div treated as a paragraph-like block

const SAFE_IMG_STYLE_PROPS = ['max-width', 'width', 'height', 'border-radius', 'margin', 'margin-top', 'margin-bottom', 'display'];

function isBold(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const fw = (el as HTMLElement).style?.fontWeight || '';
  if (fw) {
    if (fw === 'normal' || fw === '400' || Number(fw) < 600) return false; // explicit override (e.g. Google Docs wrapper div)
    if (fw === 'bold' || fw === '700' || Number(fw) >= 600) return true;
  }
  return tag === 'b' || tag === 'strong';
}

function isItalic(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const fs = (el as HTMLElement).style?.fontStyle || '';
  if (fs === 'normal') return false;
  if (fs === 'italic' || fs === 'oblique') return true;
  return tag === 'i' || tag === 'em';
}

function isUnderline(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const td = (el as HTMLElement).style?.textDecoration || (el as HTMLElement).style?.textDecorationLine || '';
  if (td.includes('none')) return false;
  if (td.includes('underline')) return true;
  return tag === 'u';
}

function sanitizeImgStyle(styleText: string | null): string {
  if (!styleText) return '';
  const kept: string[] = [];
  styleText.split(';').forEach((decl) => {
    const [propRaw, valRaw] = decl.split(':');
    if (!propRaw || !valRaw) return;
    const prop = propRaw.trim().toLowerCase();
    const val = valRaw.trim();
    if (SAFE_IMG_STYLE_PROPS.includes(prop) && !/url\(|expression\(|javascript:/i.test(val)) {
      kept.push(`${prop}: ${val}`);
    }
  });
  return kept.join('; ');
}

// Previously this required a fully-qualified https:// (or data:image/) URL,
// which silently rejects any image served via a relative or
// protocol-relative path — e.g. Next.js's image-optimization proxy
// ("/_next/image?url=..."), which is extremely common on real sites. An
// <img> can't trigger navigation the way a link can, so this only blocks
// the genuinely dangerous script-executing schemes and otherwise accepts
// whatever URL shape the source page actually used.
function isSafeImgSrc(src: string | null): boolean {
  if (!src) return false;
  const trimmed = src.trim();
  return !/^(javascript|vbscript):/i.test(trimmed);
}

// Protocol-relative ("//cdn.site.com/x.jpg") URLs need a scheme to
// actually resolve — everything else (absolute, relative, data:) is left
// as-is.
function normalizeImgSrc(src: string): string {
  const trimmed = src.trim();
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
}

const ALLOWED_IMG_CLASSES = new Set(['rte-img-left', 'rte-img-right', 'rte-img-center']);
const ALLOWED_CAPTION_CLASSES = new Set(['rte-caption']);
const ALLOWED_CAPTION_CLASS = 'rte-caption';

export function sanitizeHtml(dirty: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirty, 'text/html');

  function wrapFormatting(children: Node[], el: Element): Node {
    let container: Node = document.createDocumentFragment();
    children.forEach((c) => container.appendChild(c));

    if (isUnderline(el)) {
      const u = document.createElement('u');
      u.appendChild(container);
      container = u;
    }
    if (isItalic(el)) {
      const i = document.createElement('i');
      i.appendChild(container);
      container = i;
    }
    if (isBold(el)) {
      const b = document.createElement('b');
      b.appendChild(container);
      container = b;
    }
    return container;
  }

  function clean(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode();
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as Element;
    const tag = el.tagName.toLowerCase();

    if (['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'meta', 'link'].includes(tag)) {
      return null;
    }

    // Images: keep as a safe, self-contained element (no children to process)
    if (tag === 'img') {
      const rawSrc = el.getAttribute('src');
      if (!isSafeImgSrc(rawSrc)) return null;
      const src = normalizeImgSrc(rawSrc as string);

      const img = document.createElement('img');
      img.setAttribute('src', src);

      const alt = el.getAttribute('alt');
      if (alt) img.setAttribute('alt', alt);

      // Preserve RichTextEditor's own alignment class (rte-img-left/right/
      // center) if present — needed for the editor's (and the live site's)
      // float/center CSS to apply.
      const cls = el.getAttribute('class');
      const hasAlignClass = !!cls && ALLOWED_IMG_CLASSES.has(cls);
      if (hasAlignClass) img.setAttribute('class', cls as string);

      // FIXED: previously, any image with no existing inline style (which
      // is every rte-img-left/right/center image — they only ever carry a
      // class, never a style attribute) fell through to a hardcoded
      // fallback: 'max-width:100%; ... display:block;'. An inline style
      // always wins over a CSS class rule regardless of specificity
      // tricks, so that fallback silently overrode the class's float and
      // 45%-width every time content passed through this sanitizer —
      // which happens on every editor load. The image LOOKED like it had
      // "reverted" to full-width/center on reopen, even though the class
      // itself was preserved correctly the whole time; the fallback style
      // sitting right next to it was just winning the visual battle.
      // Now: only apply that fallback when there's no alignment class to
      // defer to, so left/right images are styled purely by CSS (their
      // class), and plain/centered images keep exactly the old behavior.
      const safeStyle = sanitizeImgStyle(el.getAttribute('style'));
      if (safeStyle) {
        img.setAttribute('style', safeStyle);
      } else if (!hasAlignClass) {
        img.setAttribute('style', 'max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;');
      }

      return img;
    }

    // Figure wrapper (image + caption together) — inserted by the
    // RichTextEditor's image tool as: <figure class="rte-img-left|
    // center|right"><img class="rte-img-inner" .../><figcaption
    // class="rte-caption">...</figcaption></figure>. Handled as its own
    // branch (like img above) rather than falling through to the generic
    // block-tag path, so the figure/figcaption structure and the
    // alignment class survive sanitization intact — without this, the
    // caption would silently vanish on every editor reload, the same bug
    // class as the earlier image-alignment issue.
    if (tag === 'figure') {
      const cls = el.getAttribute('class');
      const hasAlignClass = !!cls && ALLOWED_IMG_CLASSES.has(cls);
      const newFigure = document.createElement('figure');
      if (hasAlignClass) newFigure.setAttribute('class', cls as string);

      el.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName.toLowerCase() === 'figcaption') {
          const capEl = child as Element;
          const capCls = capEl.getAttribute('class');
          const figcaption = document.createElement('figcaption');
          if (capCls && ALLOWED_CAPTION_CLASSES.has(capCls.trim())) {
            figcaption.setAttribute('class', capCls.trim());
          }
          capEl.childNodes.forEach((n) => {
            const cleanedChild = clean(n);
            if (cleanedChild) figcaption.appendChild(cleanedChild);
          });
          newFigure.appendChild(figcaption);
        } else {
          const cleanedChild = clean(child);
          if (cleanedChild) newFigure.appendChild(cleanedChild);
        }
      });

      // A figure with no image left in it (e.g. someone deleted the img
      // some other way) isn't worth keeping.
      if (!newFigure.querySelector('img')) return null;

      return newFigure;
    }

    // Process children first (needed for both branches below)
    const cleanedChildren: Node[] = [];
    el.childNodes.forEach((child) => {
      const cleaned = clean(child);
      if (cleaned) cleanedChildren.push(cleaned);
    });

    // Generic inline containers (span, font, and any tag we don't recognize as block)
    // get unwrapped — their formatting (if any) is preserved via wrapFormatting,
    // but they do NOT become a new paragraph. This is the key fix: a bolded
    // word/phrase inside a sentence no longer breaks the sentence into its own <p>.
    const isRecognizedBlock = BLOCK_TAGS.includes(tag);
    const isAllowedInline = ['b', 'strong', 'i', 'em', 'u', 'a', 'br'].includes(tag);

    if (!isRecognizedBlock && !isAllowedInline) {
      // span / font / other unknown inline-ish wrappers → unwrap, keep formatting
      return wrapFormatting(cleanedChildren, el);
    }

    if (tag === 'br') {
      return document.createElement('br');
    }

    if (tag === 'a') {
      const newEl = document.createElement('a');
      const href = el.getAttribute('href');
      if (href) newEl.setAttribute('href', href);
      newEl.setAttribute('target', '_blank');
      newEl.setAttribute('rel', 'noopener noreferrer');
      cleanedChildren.forEach((c) => newEl.appendChild(c));
      return newEl;
    }

    if (isAllowedInline) {
      // b / strong / i / em / u — keep as-is, but also respect an explicit
      // style override (e.g. font-weight:normal on a <b> Google Docs guid wrapper)
      const wrapped = wrapFormatting(cleanedChildren, el);
      return wrapped;
    }

    // Block-level: p, h2, h3, ul, ol, li, blockquote, div(→p)
    const newTag = ALLOWED_TAGS.includes(tag) ? tag : 'p';
    const newEl = document.createElement(newTag);
    cleanedChildren.forEach((c) => newEl.appendChild(c));

    if (['p', 'h2', 'h3', 'li'].includes(newTag) && !newEl.textContent?.trim() && !newEl.querySelector('img')) {
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
