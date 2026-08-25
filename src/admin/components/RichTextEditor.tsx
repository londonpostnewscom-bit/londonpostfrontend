import { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../utils/sanitize';
import { useAdminAuth } from '../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  { cmd: 'image',               icon: '🖼️ Image',   title: 'Insert an image into the article body', isImage: true },
];

const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const BLOCK_TAGS = new Set(['DIV', 'P', 'SECTION', 'ARTICLE', 'TR', 'BLOCKQUOTE', 'FIGURE', 'FIGCAPTION', ...HEADING_TAGS]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed);
}

function isAcceptableImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  return !/^(javascript|vbscript):/i.test(trimmed);
}

function normalizeImageSrc(src: string): string {
  const trimmed = src.trim();
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
}

function firstFromSrcset(srcset: string): string {
  const first = (srcset.split(',')[0] || '').trim();
  return first.split(/\s+/)[0] || '';
}

function resolveImgSrc(el: HTMLElement): string {
  const candidates = [
    el.getAttribute('src'),
    el.getAttribute('data-src'),
    el.getAttribute('data-original'),
    el.getAttribute('data-lazy-src'),
    el.getAttribute('srcset') ? firstFromSrcset(el.getAttribute('srcset') || '') : null,
    el.getAttribute('data-srcset') ? firstFromSrcset(el.getAttribute('data-srcset') || '') : null,
  ];
  return (candidates.find(c => c && c.trim()) || '').trim();
}

function detectAlign(el: HTMLElement | null): 'left' | 'right' | 'center' {
  if (!el) return 'center';
  const style = el.getAttribute('style') || '';
  if (/float\s*:\s*left/i.test(style)) return 'left';
  if (/float\s*:\s*right/i.test(style)) return 'right';
  const cls = (el.getAttribute('class') || '').toLowerCase();
  if (/\balignleft\b/.test(cls) || /(?:^|\s)left(?:\s|$)/.test(cls)) return 'left';
  if (/\balignright\b/.test(cls) || /(?:^|\s)right(?:\s|$)/.test(cls)) return 'right';
  return 'center';
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url, 'https://dummy-base.invalid');
    if (/(^|\.)youtube\.com$/i.test(u.hostname)) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1]?.split(/[/?]/)[0] || null;
      return u.searchParams.get('v');
    }
    if (/(^|\.)youtu\.be$/i.test(u.hostname)) return u.pathname.slice(1).split(/[/?]/)[0] || null;
  } catch {}
  return null;
}
function extractVimeoId(url: string): string | null {
  try {
    const u = new URL(url, 'https://dummy-base.invalid');
    if (/(^|\.)vimeo\.com$/i.test(u.hostname)) {
      const m = u.pathname.match(/(\d{4,12})/);
      return m ? m[1] : null;
    }
  } catch {}
  return null;
}

type Fmt = { bold: boolean; italic: boolean; underline: boolean };
type Line = { html: string; tag: 'p' | 'h2' | 'h3' | 'li-ul' | 'li-ol' | 'blockquote' };

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

    if (tag === 'IMG') {
      const rawSrc = resolveImgSrc(el);
      if (!rawSrc || !isAcceptableImageSrc(rawSrc)) return;
      const src = normalizeImageSrc(rawSrc);
      const alt = escapeHtml(el.getAttribute('alt') || '');
      const ownAlign = detectAlign(el);
      const align = ownAlign !== 'center' ? ownAlign : detectAlign(el.parentElement);
      const alignClass = align === 'left' ? 'rte-img-left' : align === 'right' ? 'rte-img-right' : 'rte-img-center';
      current.push(`<img src="${escapeHtml(src)}" alt="${alt}" class="${alignClass}" />`);
      pushLine('p');
      return;
    }

    if (tag === 'IFRAME' || tag === 'VIDEO') {
      const src = (
        el.getAttribute('src') ||
        el.querySelector('source')?.getAttribute('src') ||
        ''
      ).trim();
      const ytId = extractYouTubeId(src);
      const vimeoId = !ytId ? extractVimeoId(src) : null;
      if (ytId) {
        current.push(`<div class="rte-embed-youtube" data-video-id="${escapeHtml(ytId)}"></div>`);
        pushLine('p');
      } else if (vimeoId) {
        current.push(`<div class="rte-embed-vimeo" data-video-id="${escapeHtml(vimeoId)}"></div>`);
        pushLine('p');
      }
      return;
    }

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
    const style = el.getAttribute('style') || '';
    const styleBold = /font-weight\s*:\s*(bold|[6-9]\d\d)/i.test(style);
    const styleItalic = /font-style\s*:\s*italic/i.test(style);
    const styleUnderline = /text-decoration[^:;]*:[^;]*underline/i.test(style);
    const newFmt: Fmt = {
      bold: fmt.bold || tag === 'B' || tag === 'STRONG' || styleBold,
      italic: fmt.italic || tag === 'I' || tag === 'EM' || tag === 'FIGCAPTION' || styleItalic,
      underline: fmt.underline || tag === 'U' || styleUnderline,
    };
    const isBlock = BLOCK_TAGS.has(tag);

    el.childNodes.forEach(child => walk(child, newFmt));

    if (isBlock) {
      if (isHeadingTag) {
        pushLine(tag === 'H1' || tag === 'H2' ? 'h2' : 'h3');
      } else if (tag === 'BLOCKQUOTE') {
        pushLine('blockquote');
      } else {
        pushLine('p');
      }
    }
  }

  walk(root, { bold: false, italic: false, underline: false });
  pushLine('p');

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
    } else if (line.tag === 'blockquote') {
      out.push(`<blockquote>${line.html}</blockquote>`);
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
  const { admin } = useAdminAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingReplace, setUploadingReplace] = useState(false);

  // Click-to-select image toolbar (Align / Replace / Remove) — mirrors the
  // pattern from the simpler editor, wired into the same Cloudinary upload
  // endpoint the toolbar's "Image" button already uses. The Align buttons
  // are the fix: inserted/pasted images always landed as rte-img-center
  // (full width) with no way to switch to the smaller floated
  // rte-img-left/rte-img-right treatment — those classes already existed
  // and were already allowlisted all the way through to the live article
  // page, there just wasn't a UI control to actually apply them.
  const activeImgRef = useRef<HTMLImageElement | null>(null);
  const [imgToolbarPos, setImgToolbarPos] = useState<{ top: number; left: number } | null>(null);

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

  const uploadImageFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_URL}/uploads/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${admin?.token || ''}` },
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Image upload failed');
    }
    const data = await res.json();
    if (!data.url || !isSafeUrl(data.url)) {
      throw new Error('Upload succeeded but returned no usable URL.');
    }
    return data.url;
  };

  const handleImageButtonClick = () => {
    saveSelection();
    imageInputRef.current?.click();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.');
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file);

      editorRef.current?.focus();
      restoreSelection();

      const alt = escapeHtml(file.name.replace(/\.[a-z0-9]+$/i, ''));
      document.execCommand(
        'insertHTML',
        false,
        `<img src="${escapeHtml(url)}" alt="${alt}" class="rte-img-center" />`
      );

      handleInput();
    } catch (err: any) {
      window.alert(err.message || 'Could not upload that image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Clicking any image already in the body selects it and shows a small
  // floating Align / Replace / Remove toolbar right above it. Clicking
  // anywhere else (including a different image) closes/moves it.
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const rect = target.getBoundingClientRect();
      const parentRect = editorRef.current!.getBoundingClientRect();
      activeImgRef.current = target as HTMLImageElement;
      setImgToolbarPos({ top: rect.top - parentRect.top - 36, left: rect.left - parentRect.left });
    } else {
      activeImgRef.current = null;
      setImgToolbarPos(null);
    }
  };

  const handleReplaceClick = () => {
    replaceImageInputRef.current?.click();
  };

  const handleReplaceFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeImgRef.current) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.');
      return;
    }

    setUploadingReplace(true);
    try {
      const url = await uploadImageFile(file);
      activeImgRef.current.src = url;
      handleInput();
    } catch (err: any) {
      window.alert(err.message || 'Could not upload that image. Please try again.');
    } finally {
      setUploadingReplace(false);
      setImgToolbarPos(null);
      activeImgRef.current = null;
    }
  };

  const handleRemoveImage = () => {
    activeImgRef.current?.remove();
    activeImgRef.current = null;
    setImgToolbarPos(null);
    handleInput();
  };

  const handleAlignImage = (align: 'left' | 'center' | 'right') => {
    const img = activeImgRef.current;
    if (!img) return;
    img.classList.remove('rte-img-left', 'rte-img-center', 'rte-img-right');
    img.classList.add(align === 'left' ? 'rte-img-left' : align === 'right' ? 'rte-img-right' : 'rte-img-center');
    handleInput();
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
      <div className="flex flex-wrap gap-0.5 border-b border-gray-100 bg-gray-50 p-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            disabled={(t as any).isImage && uploadingImage}
            onMouseDown={(e) => {
              e.preventDefault();
              if ((t as any).isLink)   { handleLink();   return; }
              if ((t as any).isUnlink) { handleUnlink(); return; }
              if ((t as any).isImage)  { handleImageButtonClick(); return; }
              exec(t.cmd, (t as any).isBlock);
            }}
            className="min-w-[36px] rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm disabled:opacity-50"
            dangerouslySetInnerHTML={{
              __html: (t as any).isImage && uploadingImage ? '⏳ Uploading…' : t.icon,
            }}
          />
        ))}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          ref={replaceImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleReplaceFileChosen}
        />
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={() => { handleInput(); saveSelection(); }}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onPaste={handlePaste}
          onClick={handleEditorClick}
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
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:text-gray-600
            [&_li]:mb-1 [&_p]:mb-2 [&_p]:leading-relaxed
            [&_img]:cursor-pointer
            [&_img:hover]:ring-2 [&_img:hover]:ring-indigo-300
            [&_img.rte-img-left]:float-left [&_img.rte-img-left]:mr-4 [&_img.rte-img-left]:mb-3 [&_img.rte-img-left]:max-w-[45%] [&_img.rte-img-left]:rounded-lg [&_img.rte-img-left]:h-auto
            [&_img.rte-img-right]:float-right [&_img.rte-img-right]:ml-4 [&_img.rte-img-right]:mb-3 [&_img.rte-img-right]:max-w-[45%] [&_img.rte-img-right]:rounded-lg [&_img.rte-img-right]:h-auto
            [&_img.rte-img-center]:block [&_img.rte-img-center]:mx-auto [&_img.rte-img-center]:my-3 [&_img.rte-img-center]:max-w-full [&_img.rte-img-center]:rounded-lg [&_img.rte-img-center]:h-auto
            [&_.rte-embed-youtube]:my-3 [&_.rte-embed-youtube]:flex [&_.rte-embed-youtube]:h-28 [&_.rte-embed-youtube]:items-center [&_.rte-embed-youtube]:justify-center [&_.rte-embed-youtube]:rounded-lg [&_.rte-embed-youtube]:border [&_.rte-embed-youtube]:border-red-200 [&_.rte-embed-youtube]:bg-red-50 [&_.rte-embed-youtube]:text-xs [&_.rte-embed-youtube]:font-semibold [&_.rte-embed-youtube]:text-red-500 [&_.rte-embed-youtube]:before:content-['▶_YouTube_video_attached']
            [&_.rte-embed-vimeo]:my-3 [&_.rte-embed-vimeo]:flex [&_.rte-embed-vimeo]:h-28 [&_.rte-embed-vimeo]:items-center [&_.rte-embed-vimeo]:justify-center [&_.rte-embed-vimeo]:rounded-lg [&_.rte-embed-vimeo]:border [&_.rte-embed-vimeo]:border-blue-200 [&_.rte-embed-vimeo]:bg-blue-50 [&_.rte-embed-vimeo]:text-xs [&_.rte-embed-vimeo]:font-semibold [&_.rte-embed-vimeo]:text-blue-500 [&_.rte-embed-vimeo]:before:content-['▶_Vimeo_video_attached']
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        />

        {imgToolbarPos && (
          <div
            className="absolute z-10 flex gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-1 shadow-md"
            style={{ top: imgToolbarPos.top, left: imgToolbarPos.left }}
          >
            <button
              onClick={() => handleAlignImage('left')}
              title="Align left — smaller image, text wraps around it on the right"
              className="rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              ⬅ Left
            </button>
            <button
              onClick={() => handleAlignImage('center')}
              title="Center — full width, no text wrap"
              className="rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              ⬛ Center
            </button>
            <button
              onClick={() => handleAlignImage('right')}
              title="Align right — smaller image, text wraps around it on the left"
              className="rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Right ➡
            </button>
            <span className="mx-0.5 w-px self-stretch bg-gray-200" />
            <button
              onClick={handleReplaceClick}
              disabled={uploadingReplace}
              className="rounded px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
            >
              {uploadingReplace ? 'Uploading…' : 'Replace'}
            </button>
            <button
              onClick={handleRemoveImage}
              disabled={uploadingReplace}
              className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}import { useEffect, useRef, useState } from 'react';
import { sanitizeHtml } from '../utils/sanitize';
import { useAdminAuth } from '../context/AdminAuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  { cmd: 'image',               icon: '🖼️ Image',   title: 'Insert an image into the article body', isImage: true },
];

const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const BLOCK_TAGS = new Set(['DIV', 'P', 'SECTION', 'ARTICLE', 'TR', 'BLOCKQUOTE', 'FIGURE', 'FIGCAPTION', ...HEADING_TAGS]);

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed);
}

function isAcceptableImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  return !/^(javascript|vbscript):/i.test(trimmed);
}

function normalizeImageSrc(src: string): string {
  const trimmed = src.trim();
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  return trimmed;
}

function firstFromSrcset(srcset: string): string {
  const first = (srcset.split(',')[0] || '').trim();
  return first.split(/\s+/)[0] || '';
}

function resolveImgSrc(el: HTMLElement): string {
  const candidates = [
    el.getAttribute('src'),
    el.getAttribute('data-src'),
    el.getAttribute('data-original'),
    el.getAttribute('data-lazy-src'),
    el.getAttribute('srcset') ? firstFromSrcset(el.getAttribute('srcset') || '') : null,
    el.getAttribute('data-srcset') ? firstFromSrcset(el.getAttribute('data-srcset') || '') : null,
  ];
  return (candidates.find(c => c && c.trim()) || '').trim();
}

function detectAlign(el: HTMLElement | null): 'left' | 'right' | 'center' {
  if (!el) return 'center';
  const style = el.getAttribute('style') || '';
  if (/float\s*:\s*left/i.test(style)) return 'left';
  if (/float\s*:\s*right/i.test(style)) return 'right';
  const cls = (el.getAttribute('class') || '').toLowerCase();
  if (/\balignleft\b/.test(cls) || /(?:^|\s)left(?:\s|$)/.test(cls)) return 'left';
  if (/\balignright\b/.test(cls) || /(?:^|\s)right(?:\s|$)/.test(cls)) return 'right';
  return 'center';
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url, 'https://dummy-base.invalid');
    if (/(^|\.)youtube\.com$/i.test(u.hostname)) {
      if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1]?.split(/[/?]/)[0] || null;
      return u.searchParams.get('v');
    }
    if (/(^|\.)youtu\.be$/i.test(u.hostname)) return u.pathname.slice(1).split(/[/?]/)[0] || null;
  } catch {}
  return null;
}
function extractVimeoId(url: string): string | null {
  try {
    const u = new URL(url, 'https://dummy-base.invalid');
    if (/(^|\.)vimeo\.com$/i.test(u.hostname)) {
      const m = u.pathname.match(/(\d{4,12})/);
      return m ? m[1] : null;
    }
  } catch {}
  return null;
}

type Fmt = { bold: boolean; italic: boolean; underline: boolean };
type Line = { html: string; tag: 'p' | 'h2' | 'h3' | 'li-ul' | 'li-ol' | 'blockquote' };

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

    if (tag === 'IMG') {
      const rawSrc = resolveImgSrc(el);
      if (!rawSrc || !isAcceptableImageSrc(rawSrc)) return;
      const src = normalizeImageSrc(rawSrc);
      const alt = escapeHtml(el.getAttribute('alt') || '');
      const ownAlign = detectAlign(el);
      const align = ownAlign !== 'center' ? ownAlign : detectAlign(el.parentElement);
      const alignClass = align === 'left' ? 'rte-img-left' : align === 'right' ? 'rte-img-right' : 'rte-img-center';
      current.push(`<img src="${escapeHtml(src)}" alt="${alt}" class="${alignClass}" />`);
      pushLine('p');
      return;
    }

    if (tag === 'IFRAME' || tag === 'VIDEO') {
      const src = (
        el.getAttribute('src') ||
        el.querySelector('source')?.getAttribute('src') ||
        ''
      ).trim();
      const ytId = extractYouTubeId(src);
      const vimeoId = !ytId ? extractVimeoId(src) : null;
      if (ytId) {
        current.push(`<div class="rte-embed-youtube" data-video-id="${escapeHtml(ytId)}"></div>`);
        pushLine('p');
      } else if (vimeoId) {
        current.push(`<div class="rte-embed-vimeo" data-video-id="${escapeHtml(vimeoId)}"></div>`);
        pushLine('p');
      }
      return;
    }

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
    const style = el.getAttribute('style') || '';
    const styleBold = /font-weight\s*:\s*(bold|[6-9]\d\d)/i.test(style);
    const styleItalic = /font-style\s*:\s*italic/i.test(style);
    const styleUnderline = /text-decoration[^:;]*:[^;]*underline/i.test(style);
    const newFmt: Fmt = {
      bold: fmt.bold || tag === 'B' || tag === 'STRONG' || styleBold,
      italic: fmt.italic || tag === 'I' || tag === 'EM' || tag === 'FIGCAPTION' || styleItalic,
      underline: fmt.underline || tag === 'U' || styleUnderline,
    };
    const isBlock = BLOCK_TAGS.has(tag);

    el.childNodes.forEach(child => walk(child, newFmt));

    if (isBlock) {
      if (isHeadingTag) {
        pushLine(tag === 'H1' || tag === 'H2' ? 'h2' : 'h3');
      } else if (tag === 'BLOCKQUOTE') {
        pushLine('blockquote');
      } else {
        pushLine('p');
      }
    }
  }

  walk(root, { bold: false, italic: false, underline: false });
  pushLine('p');

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
    } else if (line.tag === 'blockquote') {
      out.push(`<blockquote>${line.html}</blockquote>`);
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
  const { admin } = useAdminAuth();
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const replaceImageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingReplace, setUploadingReplace] = useState(false);

  // Click-to-select image toolbar (Align / Replace / Remove) — mirrors the
  // pattern from the simpler editor, wired into the same Cloudinary upload
  // endpoint the toolbar's "Image" button already uses. The Align buttons
  // are the fix: inserted/pasted images always landed as rte-img-center
  // (full width) with no way to switch to the smaller floated
  // rte-img-left/rte-img-right treatment — those classes already existed
  // and were already allowlisted all the way through to the live article
  // page, there just wasn't a UI control to actually apply them.
  const activeImgRef = useRef<HTMLImageElement | null>(null);
  const [imgToolbarPos, setImgToolbarPos] = useState<{ top: number; left: number } | null>(null);

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

  const uploadImageFile = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_URL}/uploads/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${admin?.token || ''}` },
      body: fd,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Image upload failed');
    }
    const data = await res.json();
    if (!data.url || !isSafeUrl(data.url)) {
      throw new Error('Upload succeeded but returned no usable URL.');
    }
    return data.url;
  };

  const handleImageButtonClick = () => {
    saveSelection();
    imageInputRef.current?.click();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.');
      return;
    }

    setUploadingImage(true);
    try {
      const url = await uploadImageFile(file);

      editorRef.current?.focus();
      restoreSelection();

      const alt = escapeHtml(file.name.replace(/\.[a-z0-9]+$/i, ''));
      document.execCommand(
        'insertHTML',
        false,
        `<img src="${escapeHtml(url)}" alt="${alt}" class="rte-img-center" />`
      );

      handleInput();
    } catch (err: any) {
      window.alert(err.message || 'Could not upload that image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Clicking any image already in the body selects it and shows a small
  // floating Align / Replace / Remove toolbar right above it. Clicking
  // anywhere else (including a different image) closes/moves it.
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const rect = target.getBoundingClientRect();
      const parentRect = editorRef.current!.getBoundingClientRect();
      activeImgRef.current = target as HTMLImageElement;
      setImgToolbarPos({ top: rect.top - parentRect.top - 36, left: rect.left - parentRect.left });
    } else {
      activeImgRef.current = null;
      setImgToolbarPos(null);
    }
  };

  const handleReplaceClick = () => {
    replaceImageInputRef.current?.click();
  };

  const handleReplaceFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !activeImgRef.current) return;

    if (!file.type.startsWith('image/')) {
      window.alert('Please choose an image file.');
      return;
    }

    setUploadingReplace(true);
    try {
      const url = await uploadImageFile(file);
      activeImgRef.current.src = url;
      handleInput();
    } catch (err: any) {
      window.alert(err.message || 'Could not upload that image. Please try again.');
    } finally {
      setUploadingReplace(false);
      setImgToolbarPos(null);
      activeImgRef.current = null;
    }
  };

  const handleRemoveImage = () => {
    activeImgRef.current?.remove();
    activeImgRef.current = null;
    setImgToolbarPos(null);
    handleInput();
  };

  const handleAlignImage = (align: 'left' | 'center' | 'right') => {
    const img = activeImgRef.current;
    if (!img) return;
    img.classList.remove('rte-img-left', 'rte-img-center', 'rte-img-right');
    img.classList.add(align === 'left' ? 'rte-img-left' : align === 'right' ? 'rte-img-right' : 'rte-img-center');
    handleInput();
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
      <div className="flex flex-wrap gap-0.5 border-b border-gray-100 bg-gray-50 p-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            disabled={(t as any).isImage && uploadingImage}
            onMouseDown={(e) => {
              e.preventDefault();
              if ((t as any).isLink)   { handleLink();   return; }
              if ((t as any).isUnlink) { handleUnlink(); return; }
              if ((t as any).isImage)  { handleImageButtonClick(); return; }
              exec(t.cmd, (t as any).isBlock);
            }}
            className="min-w-[36px] rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm disabled:opacity-50"
            dangerouslySetInnerHTML={{
              __html: (t as any).isImage && uploadingImage ? '⏳ Uploading…' : t.icon,
            }}
          />
        ))}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          ref={replaceImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleReplaceFileChosen}
        />
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={() => { handleInput(); saveSelection(); }}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onPaste={handlePaste}
          onClick={handleEditorClick}
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
            [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:my-3 [&_blockquote]:italic [&_blockquote]:text-gray-600
            [&_li]:mb-1 [&_p]:mb-2 [&_p]:leading-relaxed
            [&_img]:cursor-pointer
            [&_img:hover]:ring-2 [&_img:hover]:ring-indigo-300
            [&_img.rte-img-left]:float-left [&_img.rte-img-left]:mr-4 [&_img.rte-img-left]:mb-3 [&_img.rte-img-left]:max-w-[45%] [&_img.rte-img-left]:rounded-lg [&_img.rte-img-left]:h-auto
            [&_img.rte-img-right]:float-right [&_img.rte-img-right]:ml-4 [&_img.rte-img-right]:mb-3 [&_img.rte-img-right]:max-w-[45%] [&_img.rte-img-right]:rounded-lg [&_img.rte-img-right]:h-auto
            [&_img.rte-img-center]:block [&_img.rte-img-center]:mx-auto [&_img.rte-img-center]:my-3 [&_img.rte-img-center]:max-w-full [&_img.rte-img-center]:rounded-lg [&_img.rte-img-center]:h-auto
            [&_.rte-embed-youtube]:my-3 [&_.rte-embed-youtube]:flex [&_.rte-embed-youtube]:h-28 [&_.rte-embed-youtube]:items-center [&_.rte-embed-youtube]:justify-center [&_.rte-embed-youtube]:rounded-lg [&_.rte-embed-youtube]:border [&_.rte-embed-youtube]:border-red-200 [&_.rte-embed-youtube]:bg-red-50 [&_.rte-embed-youtube]:text-xs [&_.rte-embed-youtube]:font-semibold [&_.rte-embed-youtube]:text-red-500 [&_.rte-embed-youtube]:before:content-['▶_YouTube_video_attached']
            [&_.rte-embed-vimeo]:my-3 [&_.rte-embed-vimeo]:flex [&_.rte-embed-vimeo]:h-28 [&_.rte-embed-vimeo]:items-center [&_.rte-embed-vimeo]:justify-center [&_.rte-embed-vimeo]:rounded-lg [&_.rte-embed-vimeo]:border [&_.rte-embed-vimeo]:border-blue-200 [&_.rte-embed-vimeo]:bg-blue-50 [&_.rte-embed-vimeo]:text-xs [&_.rte-embed-vimeo]:font-semibold [&_.rte-embed-vimeo]:text-blue-500 [&_.rte-embed-vimeo]:before:content-['▶_Vimeo_video_attached']
            empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        />

        {imgToolbarPos && (
          <div
            className="absolute z-10 flex gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-1 shadow-md"
            style={{ top: imgToolbarPos.top, left: imgToolbarPos.left }}
          >
            <button
              onClick={() => handleAlignImage('left')}
              title="Align left — smaller image, text wraps around it on the right"
              className="rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              ⬅ Left
            </button>
            <button
              onClick={() => handleAlignImage('center')}
              title="Center — full width, no text wrap"
              className="rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              ⬛ Center
            </button>
            <button
              onClick={() => handleAlignImage('right')}
              title="Align right — smaller image, text wraps around it on the left"
              className="rounded px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Right ➡
            </button>
            <span className="mx-0.5 w-px self-stretch bg-gray-200" />
            <button
              onClick={handleReplaceClick}
              disabled={uploadingReplace}
              className="rounded px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
            > 
              {uploadingReplace ? 'Uploading…' : 'Replace'}
            </button>
            <button
              onClick={handleRemoveImage}
              disabled={uploadingReplace}
              className="rounded px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
