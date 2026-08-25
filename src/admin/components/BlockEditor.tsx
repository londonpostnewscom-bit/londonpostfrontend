import { useState, useRef, useEffect } from 'react';
import { RichTextEditor } from './RichTextEditor';

export type ImageAlign = 'left' | 'center' | 'right';
export type ImageSize = 'small' | 'medium' | 'full';

export type Block =
  | { id: string; type: 'text'; value: string }
  | { id: string; type: 'image'; url?: string; cloudinaryId?: string; file?: File; preview?: string; align?: ImageAlign; size?: ImageSize; caption?: string }
  | { id: string; type: 'video'; videoUrl: string }
  | { id: string; type: 'readmore'; url: string; label?: string };

let _id = 0;
const uid = () => `blk_${++_id}_${Date.now()}`;

function mkText():     Block { return { id: uid(), type: 'text',     value: '' }; }
function mkImage():    Block { return { id: uid(), type: 'image', align: 'center', size: 'full', caption: '' }; }
function mkVideo():    Block { return { id: uid(), type: 'video',    videoUrl: '' }; }
function mkReadMore(): Block { return { id: uid(), type: 'readmore', url: '', label: 'Read More' }; }

/* ─── YouTube / generic video ID extractor ── */
function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0];
  } catch {}
  return null;
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

/* ─── Small hover toolbar shared by every non-text embed ── */
function EmbedToolbar({ onUp, onDown, onRemove, canUp, canDown }: {
  onUp: () => void; onDown: () => void; onRemove: () => void; canUp: boolean; canDown: boolean;
}) {
  return (
    <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white/95 p-0.5 opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100">
      <button onClick={onUp} disabled={!canUp}
        className="rounded px-1.5 py-1 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30">↑</button>
      <button onClick={onDown} disabled={!canDown}
        className="rounded px-1.5 py-1 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30">↓</button>
      <button onClick={onRemove}
        className="rounded px-1.5 py-1 text-xs text-red-400 hover:bg-red-50">✕</button>
    </div>
  );
}

/* ─── Tiny segmented control used for both Align and Size pickers ── */
function SegmentedControl<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
            value === opt.value ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Inline image embed — now with WordPress-style Align / Size /
     Caption controls, shown once an image is actually attached. Align
     controls how it floats in the article body (left/right wraps text
     around it like a WordPress inline image; center behaves as before,
     full-width block). Size controls how large it renders when NOT
     center-full (small/medium ~ classic "thumbnail" sizes; full ignores
     the align float and always spans the column). ── */
function ImageEmbed({ block, onFile, onPatch, onRemove, onUp, onDown, canUp, canDown }: {
  block: Extract<Block, { type: 'image' }>;
  onFile: (file: File, preview: string) => void;
  onPatch: (patch: Partial<Extract<Block, { type: 'image' }>>) => void;
  onRemove: () => void; onUp: () => void; onDown: () => void; canUp: boolean; canDown: boolean;
}) {
  const inp = useRef<HTMLInputElement>(null);
  const src = block.preview || block.url || '';
  const align = block.align || 'center';
  const size = block.size || 'full';

  return (
    <div className="group relative my-3 rounded-lg border border-gray-100 bg-gray-50/50 p-2">
      <EmbedToolbar onUp={onUp} onDown={onDown} onRemove={onRemove} canUp={canUp} canDown={canDown} />
      {src ? (
        <div className="relative">
          <img src={src} alt="" className="mx-auto max-h-[420px] rounded-md object-contain" />
          <button onClick={() => inp.current?.click()}
            className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white opacity-0 hover:opacity-100 transition">
            Change
          </button>
        </div>
      ) : (
        <button onClick={() => inp.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-blue-200 bg-white py-6 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition">
          📷 Click to add image
        </button>
      )}
      <input ref={inp} type="file" accept="image/*" className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onFile(f, URL.createObjectURL(f));
          e.target.value = '';
        }}
      />

      {src && (
        <div className="mt-3 space-y-2.5 border-t border-gray-100 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-gray-500">Position</span>
            <SegmentedControl
              value={align}
              onChange={(v) => onPatch({ align: v })}
              options={[
                { value: 'left',   label: '⬅ Left' },
                { value: 'center', label: '⬛ Center' },
                { value: 'right',  label: 'Right ➡' },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 flex-shrink-0 text-[11px] font-semibold text-gray-500">Size</span>
            <SegmentedControl
              value={size}
              onChange={(v) => onPatch({ size: v })}
              options={[
                { value: 'small',  label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'full',   label: 'Full width' },
              ]}
            />
            {align !== 'center' && size === 'full' && (
              <span className="text-[10px] text-amber-600">Full width ignores Left/Right — it'll still show centered.</span>
            )}
          </div>
          <div>
            <input
              value={block.caption || ''}
              onChange={e => onPatch({ caption: e.target.value })}
              placeholder="Optional caption — shown in small text under the image"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inline video embed ── */
function VideoEmbed({ block, onChange, onRemove, onUp, onDown, canUp, canDown }: {
  block: Extract<Block, { type: 'video' }>;
  onChange: (videoUrl: string) => void;
  onRemove: () => void; onUp: () => void; onDown: () => void; canUp: boolean; canDown: boolean;
}) {
  const videoId = block.videoUrl ? extractVideoId(block.videoUrl) : null;
  const hasUrl  = block.videoUrl.trim().length > 0;

  return (
    <div className="group relative my-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
      <EmbedToolbar onUp={onUp} onDown={onDown} onRemove={onRemove} canUp={canUp} canDown={canDown} />
      <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-red-400">🎬 Video</div>
      <input
        value={block.videoUrl}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste YouTube URL — e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-200"
      />
      {hasUrl && videoId && (
        <div className="mt-2 aspect-video w-full max-w-md overflow-hidden rounded-lg shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Video preview" className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {hasUrl && !videoId && (
        <p className="mt-2 text-xs text-red-500">⚠️ Could not detect a YouTube video ID. Check the URL.</p>
      )}
    </div>
  );
}

/* ─── Inline "Read More" embed — label always editable, since not every
     link is literally a "Read More" ── */
function ReadMoreEmbed({ block, onChange, onRemove, onUp, onDown, canUp, canDown }: {
  block: Extract<Block, { type: 'readmore' }>;
  onChange: (patch: Partial<Extract<Block, { type: 'readmore' }>>) => void;
  onRemove: () => void; onUp: () => void; onDown: () => void; canUp: boolean; canDown: boolean;
}) {
  const hasUrl   = block.url.trim().length > 0;
  const urlValid = hasUrl ? isValidUrl(block.url.trim()) : true;
  const label    = block.label?.trim() ? block.label : 'Read More';

  return (
    <div className="group relative my-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
      <EmbedToolbar onUp={onUp} onDown={onDown} onRemove={onRemove} canUp={canUp} canDown={canDown} />
      <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">🔗 Button Link</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-500">Button Text</label>
          <input
            value={block.label ?? ''}
            onChange={e => onChange({ label: e.target.value })}
            placeholder="e.g. Watch Now, View Report, Continue Reading"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-gray-500">Destination Link</label>
          <input
            value={block.url}
            onChange={e => onChange({ url: e.target.value })}
            placeholder="https://example.com/full-story"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
          />
        </div>
      </div>
      {hasUrl && !urlValid && (
        <p className="mt-2 text-xs text-red-500">⚠️ That doesn't look like a valid link (needs http:// or https://).</p>
      )}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preview</span>
        <span className="pointer-events-none inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-2 text-xs font-bold text-white shadow-sm">
          {label}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ─── Slim inline insertion point — sits at the active cursor position,
     invisible until hovered or active, opens a small popover ── */
function InsertPoint({ isActive, onAdd }: {
  isActive: boolean;
  onAdd: (type: 'text' | 'image' | 'video' | 'readmore') => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`group/insert relative flex h-3 items-center justify-center ${isActive ? '' : ''}`}>
      <div className={`absolute h-px w-full transition ${isActive ? 'bg-indigo-200' : 'bg-transparent group-hover/insert:bg-gray-200'}`} />
      <button
        onClick={() => setOpen(o => !o)}
        className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border text-xs leading-none transition
          ${isActive
            ? 'border-indigo-400 bg-indigo-500 text-white opacity-100'
            : 'border-gray-300 bg-white text-gray-400 opacity-0 hover:border-indigo-400 hover:text-indigo-500 group-hover/insert:opacity-100'}`}
      >
        +
      </button>
      {open && (
        <div className="absolute left-1/2 top-6 z-20 flex flex-wrap justify-center gap-1.5 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg" style={{ width: '13rem' }}>
          {[
            { t: 'text' as const,     label: '📝 Text',      cls: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
            { t: 'image' as const,    label: '📷 Image',     cls: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { t: 'video' as const,    label: '🎬 Video',     cls: 'bg-red-50 text-red-700 hover:bg-red-100' },
            { t: 'readmore' as const, label: '🔗 Link Btn',  cls: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
          ].map(opt => (
            <button key={opt.t} onClick={() => { onAdd(opt.t); setOpen(false); }}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${opt.cls}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main BlockEditor — renders as ONE continuous box.
     `activeId` tracks whichever block currently has focus/was last clicked;
     the "+" insertion point at that position is highlighted, and adding a
     new block drops it right there — "put your cursor anywhere and insert." ── */
export function BlockEditor({ value, onChange }: {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(value[0]?.id ?? null);

  useEffect(() => {
    if (value.length && !value.some(b => b.id === activeId)) {
      setActiveId(value[value.length - 1].id);
    }
  }, [value, activeId]);

  const update = (fn: (b: Block[]) => Block[]) => onChange(fn(value));

  const insertAfter = (afterId: string | null, type: 'text' | 'image' | 'video' | 'readmore') => {
    const newBlock =
      type === 'text'     ? mkText()     :
      type === 'image'    ? mkImage()    :
      type === 'video'    ? mkVideo()    :
                             mkReadMore();
    update(b => {
      const idx = afterId ? b.findIndex(bl => bl.id === afterId) : -1;
      const copy = [...b];
      copy.splice(idx + 1, 0, newBlock);
      return copy;
    });
    setActiveId(newBlock.id);
  };

  const remove = (id: string) => update(b => b.filter(bl => bl.id !== id));

  const move = (id: string, dir: -1 | 1) => {
    update(b => {
      const idx = b.findIndex(bl => bl.id === id);
      if (idx < 0) return b;
      const next = idx + dir;
      if (next < 0 || next >= b.length) return b;
      const copy = [...b];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  };

  const setText     = (id: string, val: string) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, value: val }    as Block : bl));

  const setFile     = (id: string, file: File, preview: string) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, file, preview } as Block : bl));

  const patchImage  = (id: string, patch: Partial<Extract<Block, { type: 'image' }>>) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, ...patch }      as Block : bl));

  const setVideoUrl = (id: string, videoUrl: string) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, videoUrl }      as Block : bl));

  const setReadMore = (id: string, patch: Partial<Extract<Block, { type: 'readmore' }>>) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, ...patch }      as Block : bl));

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="relative px-4 py-3">
        <InsertPoint isActive={activeId === null} onAdd={(t) => insertAfter(null, t)} />

        {value.map((block, idx) => (
          <div key={block.id}>
            {block.type === 'text' && (
              <div onFocusCapture={() => setActiveId(block.id)} onClick={() => setActiveId(block.id)}>
                <RichTextEditor value={block.value} onChange={v => setText(block.id, v)} />
              </div>
            )}
            {block.type === 'image' && (
              <div onClick={() => setActiveId(block.id)}>
                <ImageEmbed
                  block={block as Extract<Block, { type: 'image' }>}
                  onFile={(f, p) => setFile(block.id, f, p)}
                  onPatch={(patch) => patchImage(block.id, patch)}
                  onRemove={() => remove(block.id)}
                  onUp={() => move(block.id, -1)} onDown={() => move(block.id, 1)}
                  canUp={idx > 0} canDown={idx < value.length - 1}
                />
              </div>
            )}
            {block.type === 'video' && (
              <div onClick={() => setActiveId(block.id)}>
                <VideoEmbed
                  block={block as Extract<Block, { type: 'video' }>}
                  onChange={url => setVideoUrl(block.id, url)}
                  onRemove={() => remove(block.id)}
                  onUp={() => move(block.id, -1)} onDown={() => move(block.id, 1)}
                  canUp={idx > 0} canDown={idx < value.length - 1}
                />
              </div>
            )}
            {block.type === 'readmore' && (
              <div onClick={() => setActiveId(block.id)}>
                <ReadMoreEmbed
                  block={block as Extract<Block, { type: 'readmore' }>}
                  onChange={patch => setReadMore(block.id, patch)}
                  onRemove={() => remove(block.id)}
                  onUp={() => move(block.id, -1)} onDown={() => move(block.id, 1)}
                  canUp={idx > 0} canDown={idx < value.length - 1}
                />
              </div>
            )}

            <InsertPoint isActive={activeId === block.id} onAdd={(t) => insertAfter(block.id, t)} />
          </div>
        ))}

        {value.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-10 text-center text-gray-400">
            <p className="text-sm font-semibold">Start writing, or click + to add an image, video, or link button.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Serializer (used in parent form) — now also carries align/size/caption
     for image blocks through to the backend, both for freshly-uploaded
     files (via the placeholder fieldname path) and already-hosted images. ── */
export function serializeBlocks(blocks: Block[]): {
  json: string;
  files: { fieldname: string; file: File }[];
} {
  const files: { fieldname: string; file: File }[] = [];
  let imgCount = 0;

  const json = blocks.map(b => {
    if (b.type === 'text') {
      return { type: 'text', value: b.value };
    }

    if (b.type === 'video') {
      return { type: 'video', videoUrl: b.videoUrl };
    }

    if (b.type === 'readmore') {
      return { type: 'readmore', url: b.url, label: b.label?.trim() ? b.label : 'Read More' };
    }

    const align = b.align || 'center';
    const size = b.size || 'full';
    const caption = b.caption || '';

    if (b.type === 'image' && b.file) {
      const fieldname = `block_img_${imgCount++}`;
      files.push({ fieldname, file: b.file });
      return { type: 'image', placeholder: fieldname, url: '', cloudinaryId: '', align, size, caption };
    }
    return {
      type: 'image',
      url: (b as any).url || '',
      cloudinaryId: (b as any).cloudinaryId || '',
      align, size, caption,
    };
  });

  return { json: JSON.stringify(json), files };
}

/* ─── Deserializer (used when editing existing article) — reads back
     align/size/caption, defaulting to the original center/full/'' so any
     article saved before this change still renders exactly as before. ── */
export function deserializeBlocks(raw: any[]): Block[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(b => {
    if (b.type === 'text') {
      return { id: uid(), type: 'text' as const, value: b.value || '' };
    }
    if (b.type === 'video') {
      return { id: uid(), type: 'video' as const, videoUrl: b.videoUrl || '' };
    }
    if (b.type === 'readmore') {
      return { id: uid(), type: 'readmore' as const, url: b.url || '', label: b.label || 'Read More' };
    }
    return {
      id: uid(),
      type: 'image' as const,
      url: b.url || '',
      cloudinaryId: b.cloudinaryId || '',
      align: (b.align === 'left' || b.align === 'right' || b.align === 'center') ? b.align : 'center',
      size: (b.size === 'small' || b.size === 'medium' || b.size === 'full') ? b.size : 'full',
      caption: b.caption || '',
    };
  });
}
