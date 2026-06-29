
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
  { cmd: 'removeFormat',        icon: '✕ Clear',    title: 'Clear Formatting' },
];

/* ─── Paste-cleaning helpers ──────────────────────────────────────────── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Rebuilds clean <p> paragraphs from pasted plain text.
 *
 * Why this exists: copying text from news sites / many web pages puts
 * HTML on the clipboard where the source wraps every visual LINE in its
 * own block element (one <div>/<p>/<span> per line, sometimes even per
 * word, for layout/ad-injection reasons on the source page). If we trust
 * that HTML, every one of those wrapper elements survives sanitization
 * and renders on its own row — that's the "every word on a new line" bug.
 *
 * The fix: ignore clipboard HTML for body text entirely. Use plain text
 * only, and only treat a BLANK line (a real paragraph break) as the
 * start of a new <p>. A single newline is just line-wrap noise from the
 * source and gets collapsed into a space so words don't run together
 * or get split apart.
 */
function plainTextToParagraphs(text: string): string {
  const normalized = text
    .replace(/\r\n/g, '\n')   // normalize Windows line endings
    .replace(/\u00A0/g, ' '); // non-breaking spaces -> normal spaces

  const chunks = normalized
    .split(/\n\s*\n+/)                       // real paragraph break = blank line
    .map(p => p.replace(/\n+/g, ' ').replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);

  return chunks.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

export function RichTextEditor({ value, onChange, placeholder }: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Set initial content once only
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = sanitizeHtml(value);
    }
  }, []);

  const exec = (cmd: string, isBlock = false) => {
    if (isBlock) {
      document.execCommand('formatBlock', false, cmd);
    } else {
      document.execCommand(cmd, false, undefined);
    }
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Key fix: always paste as plain text, rebuilt into clean paragraphs.
  // We deliberately do NOT use clipboardData's text/html for body content
  // — that's the channel that was injecting one wrapper element per
  // source line and making every line (or word) render on its own row.
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const plain = e.clipboardData.getData('text/plain');
    const clean = sanitizeHtml(plainTextToParagraphs(plain));

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
              exec(t.cmd, t.isBlock);
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
        onBlur={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder || 'Write or paste article content here...'}
        style={{ resize: 'vertical', overflow: 'auto', minHeight: '220px' }}
        className="block w-full px-4 py-3 text-sm text-gray-800 outline-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-gray-900
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-gray-800
          [&_b]:font-bold [&_strong]:font-bold
          [&_i]:italic [&_em]:italic
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
          [&_li]:mb-1 [&_p]:mb-2 [&_p]:leading-relaxed
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
      />
    </div>
  );
}
