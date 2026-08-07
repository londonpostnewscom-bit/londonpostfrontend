import { useEffect, useRef } from 'react';
import { sanitizeHtml } from '../utils/sanitize';

const TOOLS = [
  { cmd: 'bold',                icon: '<b>B</b>',   title: 'Bold' },
  { cmd: 'italic',              icon: '<i>I</i>',   title: 'Italic' },
  { cmd: 'underline',           icon: '<u>U</u>',   title: 'Underline' },
  { cmd: 'h2',                  icon: 'H2',         title: 'Heading 2', isBlock: true },
  { cmd: 'h3',                  icon: 'H3',         title: 'Heading 3', isBlock: true },
  { cmd: 'insertUnorderedList', icon: '• List',     title: 'Bullet List' },
  { cmd: 'insertOrderedList',   icon: '1. List',    title: 'Numbered List' },
  { cmd: 'justifyLeft',         icon: '⬅ Left',     title: 'Align Left' },
  { cmd: 'justifyCenter',       icon: '⬛ Center',   title: 'Center' },
  { cmd: 'link',                icon: '🔗 Link',    title: 'Turn selected text into a link', isLink: true },
  { cmd: 'unlink',              icon: '⛓️‍💥 Unlink', title: 'Remove link',                    isUnlink: true },
  { cmd: 'removeFormat',        icon: '✕ Clear',    title: 'Clear Formatting' },
];

const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
// NOTE: LI is intentionally handled separately (inside UL/OL), not as a
// generic paragraph-breaking block — see extractLines below.
const BLOCK_TAGS = new Set(['DIV', 'P', 'SECTION', 'ARTICLE', 'TR', ...HEADING_TAGS]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Basic sanity check so we don't create javascript: links or similar.
function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed);
}

type Fmt = { bold: boolean; italic: boolean; underline: boolean };
type Line = { html: string; tag: 'p' | 'h2' | 'h3' | 'li-ul' | 'li-ol' };

/**
 * Walks the pasted DOM and produces ONE output line per source block-level
 * element (p, div, h1-h6, li, tr) — never merging separate source
 * paragraphs together, and never guessing that a short bold line should
 * become a heading. What was a paragraph in the source stays a paragraph.
 * What was a heading tag in the source stays a heading. Bold/italic/
 * underline/links are preserved wherever they were actually applied.
 */
function extractLines(root: Node): Line[] {
  const lines: Line[] = [];
  let current: string[] = [];

  function pushLine(tag: Line['tag']) {
    const html = current.join('').trim();
    current = [];
    if (html !== '') lines.push({ html, tag });
  }

  function walk(node: Node, fmt: Fmt) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').replace(/\u00A0/g, ' ');
      if (text === '') return;
      let escaped = escapeHtml(text);
      if (fmt.bold) escaped = `<b>${escaped}</b>`;
      if (fmt.italic) escaped = `<i>${escaped}</i>`;
      if (fmt.underline) escaped = `<u>${escaped}</u>`;
      current.push(escaped);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName;

    if (tag === 'SCRIPT' || tag === 'STYLE') return;
    if (tag === 'BR') { current.push('<br>'); return; }

    if (tag === 'UL' || tag === 'OL') {
      const liTag: Line['tag'] = tag === 'UL' ? 'li-ul' : 'li-ol';
      el.querySelectorAll(':scope > li').forEach(li => {
        (li.childNodes as any).forEach((child: Node) => walk(child, fmt));
        pushLine(liTag);
      });
      return;
    }

    if (tag === 'A') {
      const href = (el.getAttribute('href') || '').trim();
      const startLen = current.length;
      el.childNodes.forEach(child => walk(child, fmt));
      if (isSafeUrl(href)) {
        const inner = current.splice(startLen).join('');
        current.push(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`);
      }
      return;
    }

    const isHeadingTag = HEADING_TAGS.has(tag);
    const newFmt: Fmt = {
      bold: fmt.bold || tag === 'B' || tag === 'STRONG',
      italic: fmt.italic || tag === 'I' || tag === 'EM',
      underline: fmt.underline || tag === 'U',
    };
    const isBlock = BLOCK_TAGS.has(tag);

    el.childNodes.forEach(child => walk(child, newFmt));

    if (isBlock) {
      if (isHeadingTag) {
        // Preserve the source's actual heading level; only H1/H2 map to H2,
        // everything H3 and deeper maps to H3 (the two levels this editor supports).
        pushLine(tag === 'H1' || tag === 'H2' ? 'h2' : 'h3');
      } else {
        pushLine('p');
      }
    }
  }

  walk(root, { bold: false, italic: false, underline: false });
  pushLine('p'); // flush any trailing content that wasn't inside a block element

  return lines;
}

function buildContent(lines: Line[]): string {
  const out: string[] = [];
  let listBuffer: { tag: 'li-ul' | 'li-ol'; items: string[] } | null = null;

  function flushList() {
    if (!listBuffer) return;
    const wrap = listBuffer.tag === 'li-ul' ? 'ul' : 'ol';
    out.push(`<${wrap}>${listBuffer.items.map(i => `<li>${i}</li>`).join('')}</${wrap}>`);
    listBuffer = null;
  }

  for (const line of lines) {
    if (line.tag === 'li-ul' || line.tag === 'li-ol') {
      if (!listBuffer || listBuffer.tag !== line.tag) { flushList(); listBuffer = { tag: line.tag, items: [] }; }
      listBuffer.items.push(line.html);
      continue;
    }
    flushList();
    if (line.tag === 'h2' || line.tag === 'h3') {
      out.push(`<${line.tag}>${line.html}</${line.tag}>`);
    } else {
      out.push(`<p>${line.html}</p>`);
    }
  }
  flushList();
  return out.join('');
}

function cleanPastedHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const lines = extractLines(parsed.body);
  return buildContent(lines);
}

// Plain-text fallback (e.g. pasting from a source with no HTML at all,
// like a plain .txt file or terminal). Every single line break becomes its
// own paragraph — we don't merge lines, and we don't require a blank line
// between them, so paragraph breaks are preserved exactly as typed.
function plainTextToParagraphs(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ');
  const lines = normalized.split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim());
  return lines.filter(l => l !== '').map(l => `<p>${escapeHtml(l)}</p>`).join('');
}

export function RichTextEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Set initial content once only
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = sanitizeHtml(value);
    }
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const exec = (cmd: string, isBlock = false) => {
    if (isBlock) {
      document.execCommand('formatBlock', false, cmd);
    } else {
      document.execCommand(cmd, false, undefined);
    }
    editorRef.current?.focus();
  };

  const handleLink = () => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !editorRef.current?.contains(sel.anchorNode)) {
      window.alert('First select the text you want to turn into a link, then click Link.');
      return;
    }

    const url = window.prompt('Paste the link URL (must start with http:// or https://)', 'https://');
    if (!url) return;
    if (!isSafeUrl(url)) {
      window.alert('That link needs to start with http://, https://, or mailto:.');
      return;
    }

    document.execCommand('createLink', false, url.trim());

    editorRef.current?.querySelectorAll(`a[href="${url.trim()}"]`).forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });

    editorRef.current?.focus();
    handleInput();
  };

  const handleUnlink = () => {
    restoreSelection();
    document.execCommand('unlink', false, undefined);
    editorRef.current?.focus();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const html = e.clipboardData.getData('text/html');
    const plain = e.clipboardData.getData('text/plain');

    const rebuilt = html ? cleanPastedHtml(html) : plainTextToParagraphs(plain);
    const clean = sanitizeHtml(rebuilt);

    document.execCommand('insertHTML', false, clean);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-b border-gray-100 bg-gray-50 p-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            onMouseDown={(e) => {
              e.preventDefault();
              if ((t as any).isLink)   { handleLink();   return; }
              if ((t as any).isUnlink) { handleUnlink(); return; }
              exec(t.cmd, (t as any).isBlock);
            }}
            className="min-w-[36px] rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
            dangerouslySetInnerHTML={{ __html: t.icon }}
          />
        ))}
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={() => { handleInput(); saveSelection(); }}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onPaste={handlePaste}
        data-placeholder={placeholder || 'Write or paste article content here...'}
        style={{ resize: 'vertical', overflow: 'auto', minHeight: '220px' }}
        className="block w-full px-4 py-3 text-sm text-gray-800 outline-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-gray-900
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-gray-800
          [&_b]:font-bold [&_strong]:font-bold
          [&_i]:italic [&_em]:italic
          [&_a]:text-blue-600 [&_a]:underline [&_a]:decoration-blue-300 [&_a]:underline-offset-2
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
          [&_li]:mb-1 [&_p]:mb-2 [&_p]:leading-relaxed
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
      />
    </div>
  );
}
