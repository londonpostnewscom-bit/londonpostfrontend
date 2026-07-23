
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


const HEADING_TAGS = new Set(['H1','H2','H3','H4','H5','H6']);
const BLOCK_TAGS = new Set(['DIV','P','SECTION','ARTICLE','LI','TR','BR', ...HEADING_TAGS]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

type Line = { html: string; isBlank: boolean; isHeadingSource: boolean };

function extractLines(root: Node): Line[] {
  const lines: Line[] = [];
  let current: string[] = [];

  function flushLine() {
    const html = current.join('').trim();
    current = [];
    lines.push(html === ''
      ? { html: '', isBlank: true, isHeadingSource: false }
      : { html, isBlank: false, isHeadingSource: false });
  }

  function walk(node: Node, inheritBold: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '').replace(/\u00A0/g, ' ');
      if (text === '') return;
      const escaped = escapeHtml(text);
      current.push(inheritBold ? `<b>${escaped}</b>` : escaped);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName;

    if (tag === 'SCRIPT' || tag === 'STYLE') return;
    if (tag === 'BR') { flushLine(); return; }

    const isBoldTag = tag === 'B' || tag === 'STRONG';
    const isHeadingTag = HEADING_TAGS.has(tag);
    const boldNow = inheritBold || isBoldTag || isHeadingTag;
    const isBlock = BLOCK_TAGS.has(tag);

    el.childNodes.forEach(child => walk(child, boldNow));

    if (isBlock) {
      flushLine();
      if (isHeadingTag && lines.length > 0) {
        lines[lines.length - 1].isHeadingSource = true;
      }
    }
  }

  walk(root, false);
  flushLine();

  // Collapse consecutive blank lines into one
  return lines.filter((l, i) => {
    if (!l.isBlank) return true;
    const prev = lines[i - 1];
    return !(prev && prev.isBlank);
  });
}

// Short + fully-bold (or a real heading tag) reads as a sub-heading.
// Long bold passages (emphasis within a normal paragraph) stay as <p>.
function looksLikeHeading(line: Line): boolean {
  if (line.isBlank) return false;
  if (line.isHeadingSource) return true;

  const plain = line.html.replace(/<[^>]+>/g, '');
  if (plain.length === 0 || plain.length > 80) return false;

  return /^<b>.*<\/b>$/.test(line.html.trim());
}

function buildParagraphs(lines: Line[]): string {
  const out: string[] = [];
  let buffer: string[] = [];

  function flushBuffer() {
    if (buffer.length === 0) return;
    const joined = buffer.join(' ').replace(/\s+/g, ' ').trim();
    if (joined) out.push(`<p>${joined}</p>`);
    buffer = [];
  }

  for (const line of lines) {
    if (line.isBlank) { flushBuffer(); continue; }
    if (looksLikeHeading(line)) {
      flushBuffer();
      const plain = line.html.replace(/<\/?b>/g, '').replace(/<\/?strong>/g, '');
      out.push(`<h3>${plain}</h3>`);
      continue;
    }
    buffer.push(line.html);
  }
  flushBuffer();
  return out.join('');
}

function cleanPastedHtml(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const lines = extractLines(parsed.body);
  return buildParagraphs(lines);
}

// Plain-text fallback (e.g. pasting from a source with no HTML at all,
// like a plain .txt file or terminal) -- same blank-line paragraph rule,
// just with no formatting to preserve.
function plainTextToParagraphs(text: string): string {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ');
  const chunks = normalized
    .split(/\n\s*\n+/)
    .map(p => p.replace(/\n+/g, ' ').replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);
  return chunks.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

// Basic sanity check so we don't create javascript: links or similar.
function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed);
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

  // Turns the current text selection into a real hyperlink. Requires an
  // actual (non-collapsed) selection, since a link needs visible text to
  // attach to. Opens safely in a new tab via target + rel, which
  // execCommand doesn't set on its own.
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

    // execCommand doesn't let us set target/rel directly — patch the
    // anchor(s) it just created so links always open in a new tab safely.
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
