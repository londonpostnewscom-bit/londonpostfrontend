

import { useState, useRef } from 'react';
import { RichTextEditor } from './RichTextEditor';

export type Block =
  | { id: string; type: 'text'; value: string }
  | { id: string; type: 'image'; url?: string; cloudinaryId?: string; file?: File; preview?: string }
  | { id: string; type: 'video'; videoUrl: string }
  | { id: string; type: 'readmore'; url: string; label?: string };

let _id = 0;
const uid = () => `blk_${++_id}_${Date.now()}`;

function mkText():     Block { return { id: uid(), type: 'text',     value: '' }; }
function mkImage():    Block { return { id: uid(), type: 'image' }; }
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

/* ─── Single image block ── */
function ImageBlock({ block, onFile, onRemove }: {
  block: Extract<Block, { type: 'image' }>;
  onFile: (file: File, preview: string) => void;
  onRemove: () => void;
}) {
  const inp = useRef<HTMLInputElement>(null);
  const src = block.preview || block.url || '';

  return (
    <div className="relative rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">📷 Image Block</span>
        <button onClick={onRemove} className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100">Remove</button>
      </div>

      {src ? (
        <div className="relative group mb-2">
          <img src={src} alt="" className="w-full rounded-lg object-contain" style={{ maxHeight: '600px' }} />
          <button onClick={() => inp.current?.click()}
            className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition">
            Change
          </button>
        </div>
      ) : (
        <button onClick={() => inp.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white py-8 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Click to select image
        </button>
      )}

      <input ref={inp} type="file" accept="image/*" className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) onFile(f, URL.createObjectURL(f));
          e.target.value = '';
        }}
      />
    </div>
  );
}

/* ─── Single video block ── */
function VideoBlock({ block, onChange, onRemove }: {
  block: Extract<Block, { type: 'video' }>;
  onChange: (videoUrl: string) => void;
  onRemove: () => void;
}) {
  const videoId = block.videoUrl ? extractVideoId(block.videoUrl) : null;
  const hasUrl  = block.videoUrl.trim().length > 0;

  return (
    <div className="relative rounded-xl border-2 border-dashed border-red-200 bg-red-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">🎬 Video Block</span>
        <button onClick={onRemove}
          className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100">
          Remove
        </button>
      </div>

      <input
        value={block.videoUrl}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste YouTube URL — e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-200"
      />

      {/* Live preview */}
      {hasUrl && videoId && (
        <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl shadow-sm">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Video preview"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Error state — URL entered but no ID parsed */}
      {hasUrl && !videoId && (
        <p className="mt-2 text-xs text-red-500">
          ⚠️ Could not detect a YouTube video ID. Make sure the URL is a valid YouTube link.
        </p>
      )}

      {!hasUrl && (
        <p className="mt-2 text-xs text-gray-400">
          Paste a YouTube URL above and a live preview will appear here.
        </p>
      )}
    </div>
  );
}

/* ─── Single "Read More" button block ── */
function ReadMoreBlock({ block, onChange, onRemove }: {
  block: Extract<Block, { type: 'readmore' }>;
  onChange: (patch: Partial<Extract<Block, { type: 'readmore' }>>) => void;
  onRemove: () => void;
}) {
  const hasUrl   = block.url.trim().length > 0;
  const urlValid = hasUrl ? isValidUrl(block.url.trim()) : true;
  const label    = block.label?.trim() ? block.label : 'Read More';

  return (
    <div className="relative rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">🔗 Read More Button</span>
        <button onClick={onRemove}
          className="rounded-lg border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100">
          Remove
        </button>
      </div>

      <label className="mb-1 block text-[11px] font-semibold text-gray-500">Button Text</label>
      <input
        value={block.label ?? ''}
        onChange={e => onChange({ label: e.target.value })}
        placeholder="Read More"
        className="mb-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
      />

      <label className="mb-1 block text-[11px] font-semibold text-gray-500">Destination Link</label>
      <input
        value={block.url}
        onChange={e => onChange({ url: e.target.value })}
        placeholder="https://example.com/full-story"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-200"
      />

      {hasUrl && !urlValid && (
        <p className="mt-2 text-xs text-red-500">
          ⚠️ That doesn't look like a valid link. Make sure it starts with http:// or https://
        </p>
      )}

      {!hasUrl && (
        <p className="mt-2 text-xs text-gray-400">
          Paste the link you want opened when a reader taps this button. It always opens in a new tab.
        </p>
      )}

      {/* Live preview of the button as it will appear on the article */}
      <div className="mt-4 flex items-center gap-3 border-t border-emerald-100 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Preview</span>
        <span className="pointer-events-none relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/30">
          {label}
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/* ─── Add block button row ── */
function AddButtons({ onAdd }: { onAdd: (type: 'text' | 'image' | 'video' | 'readmore') => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex justify-center py-1">
      <div className="absolute top-1/2 h-px w-full bg-gray-200" />
      <button
        onClick={() => setOpen(o => !o)}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400 text-lg leading-none transition hover:border-indigo-400 hover:text-indigo-500">
        +
      </button>
      {open && (
        <div className="absolute left-1/2 top-8 z-20 flex flex-wrap justify-center gap-2 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg" style={{ width: '15rem' }}>
          <button
            onClick={() => { onAdd('text');  setOpen(false); }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100">
            📝 Text
          </button>
          <button
            onClick={() => { onAdd('image'); setOpen(false); }}
            className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100">
            📷 Image
          </button>
          <button
            onClick={() => { onAdd('video'); setOpen(false); }}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100">
            🎬 Video
          </button>
          <button
            onClick={() => { onAdd('readmore'); setOpen(false); }}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100">
            🔗 Read More
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main BlockEditor ── */
export function BlockEditor({ value, onChange }: {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const update = (fn: (b: Block[]) => Block[]) => onChange(fn(value));

  const insert = (index: number, type: 'text' | 'image' | 'video' | 'readmore') => {
    update(b => {
      const copy = [...b];
      copy.splice(index, 0,
        type === 'text'     ? mkText()     :
        type === 'image'    ? mkImage()    :
        type === 'video'    ? mkVideo()    :
                               mkReadMore()
      );
      return copy;
    });
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

  const setVideoUrl = (id: string, videoUrl: string) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, videoUrl }      as Block : bl));

  const setReadMore = (id: string, patch: Partial<Extract<Block, { type: 'readmore' }>>) =>
    update(b => b.map(bl => bl.id === id ? { ...bl, ...patch }      as Block : bl));

  const blockTypeLabel = (b: Block) =>
    b.type === 'text' ? '📝 Text' :
    b.type === 'image' ? '📷 Image' :
    b.type === 'video' ? '🎬 Video' :
    '🔗 Read More';

  return (
    <div className="space-y-1">
      <AddButtons onAdd={(t) => insert(0, t)} />

      {value.map((block, idx) => (
        <div key={block.id}>
          {/* Block card */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

            {/* Block toolbar */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-3 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {blockTypeLabel(block)} — Block {idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(block.id, -1)} disabled={idx === 0}
                  className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30">↑</button>
                <button onClick={() => move(block.id, 1)} disabled={idx === value.length - 1}
                  className="rounded px-1.5 py-0.5 text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30">↓</button>
                <button onClick={() => remove(block.id)}
                  className="rounded px-1.5 py-0.5 text-xs text-red-400 hover:bg-red-50">✕</button>
              </div>
            </div>

            {/* Block content */}
            <div className={block.type === 'text' ? '' : 'p-3'}>
              {block.type === 'text' && (
                <RichTextEditor value={block.value} onChange={v => setText(block.id, v)} />
              )}
              {block.type === 'image' && (
                <ImageBlock
                  block={block as Extract<Block, { type: 'image' }>}
                  onFile={(f, p) => setFile(block.id, f, p)}
                  onRemove={() => remove(block.id)}
                />
              )}
              {block.type === 'video' && (
                <VideoBlock
                  block={block as Extract<Block, { type: 'video' }>}
                  onChange={url => setVideoUrl(block.id, url)}
                  onRemove={() => remove(block.id)}
                />
              )}
              {block.type === 'readmore' && (
                <ReadMoreBlock
                  block={block as Extract<Block, { type: 'readmore' }>}
                  onChange={patch => setReadMore(block.id, patch)}
                  onRemove={() => remove(block.id)}
                />
              )}
            </div>
          </div>

          <AddButtons onAdd={(t) => insert(idx + 1, t)} />
        </div>
      ))}

      {value.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
          <p className="text-sm font-semibold">No content blocks yet.</p>
          <p className="mt-1 text-xs">Click the + button above to add your first text, image, video, or Read More block.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Serializer (used in parent form) ── */
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
      // Just store the URL string — no file upload needed
      return { type: 'video', videoUrl: b.videoUrl };
    }

    if (b.type === 'readmore') {
      return { type: 'readmore', url: b.url, label: b.label?.trim() ? b.label : 'Read More' };
    }

    // image
    if (b.type === 'image' && b.file) {
      const fieldname = `block_img_${imgCount++}`;
      files.push({ fieldname, file: b.file });
      return { type: 'image', placeholder: fieldname, url: '', cloudinaryId: '' };
    }
    return {
      type: 'image',
      url: (b as any).url || '',
      cloudinaryId: (b as any).cloudinaryId || '',
    };
  });

  return { json: JSON.stringify(json), files };
}

/* ─── Deserializer (used when editing existing article) ── */
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
    // default: image
    return {
      id: uid(),
      type: 'image' as const,
      url: b.url || '',
      cloudinaryId: b.cloudinaryId || '',
    };
  });
}
