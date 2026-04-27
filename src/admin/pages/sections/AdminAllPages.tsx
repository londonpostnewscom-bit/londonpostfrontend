import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { RichTextEditor } from '../../components/RichTextEditor';


const HOME_FEATURED_SECTIONS = [
  { value: 'latest-news',      label: 'Latest News',       type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'editors-articles', label: "Editor's Articles", type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'asean',            label: 'ASEAN',             type: 'region' as const,
    subCategories: ['Indonesia','Malaysia','Singapore','Thailand','Vietnam','Philippines','Cambodia','Laos','Myanmar','Brunei'], isVideo: false },
  { value: 'central-asia',     label: 'Central Asia',      type: 'region' as const,
    subCategories: ['Kazakhstan','Kyrgyzstan','Tajikistan','Turkmenistan','Uzbekistan'], isVideo: false },
];

const MORE_SECTIONS = [
  { value: 'interviews',        label: 'Interviews',         type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'sports',            label: 'Sports',             type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'art-culture',       label: 'Art & Culture',      type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'hidden-histories',  label: 'Hidden Histories',   type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'youth-voices',      label: 'Youth Voices',       type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'economy',           label: 'Economy',            type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'defence',           label: 'Defence',            type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'video',             label: 'Video',              type: 'section' as const, subCategories: [], isVideo: true  },
  { value: 'opinion',           label: 'Opinion',            type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'diplomatic-corner', label: 'Diplomatic Horizon', type: 'section' as const, subCategories: [], isVideo: false },
];

const ALL_SECTIONS = [...HOME_FEATURED_SECTIONS, ...MORE_SECTIONS];

const HOME_OPTIONS = [
  { value: 'hero',              label: '⭐ Hero / Headline',           max: 5 },
  { value: 'latest-news',       label: '📰 Latest News Block',        max: 5 },
  { value: 'editors-articles',  label: "✍️ Editor's Articles Block",   max: 5 },
  { value: 'asean-home',        label: '🌏 ASEAN Home Feature',        max: 6 },
  { value: 'central-asia',      label: '🌏 Central Asia Carousel',     max: 5 },
  { value: 'interviews',        label: '🎤 Interviews Home Block',    max: 4 },
  { value: 'opinion',           label: '💬 Opinion Home Block',       max: 4 },
  
];

const MONTHS = [
  {v:'1',l:'January'},{v:'2',l:'February'},{v:'3',l:'March'},{v:'4',l:'April'},
  {v:'5',l:'May'},{v:'6',l:'June'},{v:'7',l:'July'},{v:'8',l:'August'},
  {v:'9',l:'September'},{v:'10',l:'October'},{v:'11',l:'November'},{v:'12',l:'December'},
];


function BreakingNewsManager() {
  const { get, put } = useAdminApi();
  const [items, setItems]   = useState<string[]>([]);
  const [input, setInput]   = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { get('/breaking-news').then(d => setItems(Array.isArray(d) ? d : [])).catch(() => {}); }, []);

  const save = async (newItems: string[]) => {
    setSaving(true);
    try { await put('/breaking-news', { items: newItems }); setItems(newItems); } catch {}
    setSaving(false);
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-3">
      <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-2">📢 Breaking News Ticker</h3>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a breaking news line…" className="input flex-1"
          onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { save([...items, input.trim()]); setInput(''); }}} />
        <button onClick={() => { if (input.trim()) { save([...items, input.trim()]); setInput(''); }}}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Add</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <span className="text-sm text-gray-700 flex-1">{item}</span>
          <button onClick={() => save(items.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700">Remove</button>
        </div>
      ))}
      {saving && <p className="text-xs text-gray-400">Saving…</p>}
    </div>
  );
}
function slugify(s: string) {
  return s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function normalizeHashtags(text: string): string[] {
  return [...new Set(
    text.split(',').map(t=>t.trim()).filter(Boolean)
      .map(t=>t.replace(/^#+/,'').replace(/\s+/g,'-').replace(/[^a-zA-Z0-9-_]/g,''))
      .filter(Boolean).slice(0,20)
  )];
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${value?'bg-red-600':'bg-gray-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${value?'translate-x-4':'translate-x-0.5'}`} />
    </button>
  );
}

type SectionConfig = typeof ALL_SECTIONS[0];

const FORM_EMPTY = {
  title:'', subtitle:'', content:'', author:'', date:'', category:'',
  subCategory:'', hashtags:[] as string[], isFeatured:false, isArchived:false,
  isActive:true, sortOrder:0, showOnHome:false, homeSection:'', homeSortOrder:1, videoId:'',
};

function UnifiedForm({ init, sectionConfig, onSave, onCancel, saving, error }: {
  init?: any; sectionConfig: SectionConfig;
  onSave: (data: any, file: File | null, galleryFiles: File[]) => void;
  onCancel: () => void; saving: boolean; error: string;
}) {
  const [f, setF] = useState<any>({ ...FORM_EMPTY, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPrev] = useState(init?.imageUrl || '');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    Array.isArray(init?.galleryImages) ? init.galleryImages.map((img: any) => img.url) : []
  );
  const [hashTxt, setHT] = useState(Array.isArray(init?.hashtags) ? init.hashtags.join(', ') : '');

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const homeOpt = HOME_OPTIONS.find(o => o.value === f.homeSection);
  const homeMax = homeOpt?.max ?? 5;
  const subCats = sectionConfig.subCategories || [];
  const isVideo = sectionConfig.isVideo;
  const ytThumb = isVideo && f.videoId ? `https://img.youtube.com/vi/${f.videoId}/maxresdefault.jpg` : null;
  const hashTags = normalizeHashtags(hashTxt);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
      <h3 className="border-b border-gray-100 pb-3 text-base font-semibold text-gray-800">
        {init?._id ? 'Edit' : 'New'} Article — {sectionConfig.label}
      </h3>
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Title *</label>
          <input value={f.title} onChange={e => s('title', e.target.value)} className="input w-full" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Subtitle</label>
          <input value={f.subtitle} onChange={e => s('subtitle', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Author</label>
          <input value={f.author} onChange={e => s('author', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Date (e.g. April 17, 2026)</label>
          <input value={f.date} onChange={e => s('date', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Category</label>
          <input value={f.category} onChange={e => s('category', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Sort Order (lower = first)</label>
          <input type="number" value={f.sortOrder} onChange={e => s('sortOrder', Number(e.target.value))} className="input w-full" />
        </div>

        {subCats.length > 0 && (
          <div className="sm:col-span-2">
            <label className="label">Sub-Category (filter tab)</label>
            <select value={f.subCategory} onChange={e => s('subCategory', e.target.value)} className="input w-full">
              <option value="">— Show under all of {sectionConfig.label} —</option>
              {subCats.map((sc: string) => <option key={sc} value={slugify(sc)}>{sc}</option>)}
            </select>
          </div>
        )}

        {isVideo && (
          <div className="sm:col-span-2">
            <label className="label">YouTube Video ID *</label>
            <input value={f.videoId} onChange={e => s('videoId', e.target.value.trim())} placeholder="e.g. dQw4w9WgXcQ" className="input w-full" />
            {ytThumb && (
              <div className="relative mt-3 w-48 overflow-hidden rounded-xl">
                <img src={ytThumb} alt="" className="w-full rounded-xl object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90">
                    <svg className="ml-0.5 h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="label">Hashtags (comma separated)</label>
          <input value={hashTxt} onChange={e => setHT(e.target.value)} placeholder="politics, diplomacy, asia" className="input w-full" />
          {hashTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashTags.map(t => <span key={t} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">#{t}</span>)}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="label">Full Article Content</label>
        <RichTextEditor value={f.content} onChange={html => s('content', html)} />
      </div>

      <div>
        <label className="label">Cover Image {isVideo ? '(optional)' : ''}</label>
        <div className="flex flex-wrap items-center gap-3">
          {preview && <img src={preview} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-200" />}
          <input type="file" accept="image/*"
            onChange={e => { const fl = e.target.files?.[0]; if (fl) { setFile(fl); setPrev(URL.createObjectURL(fl)); }}}
            className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
          />
        </div>
      </div>

      <div>
        <label className="label">Article Detail Images — optional, max 5</label>
        <input type="file" accept="image/*" multiple
          onChange={e => {
            const selected = Array.from(e.target.files || []).slice(0, 5);
            setGalleryFiles(selected);
            setGalleryPreviews(selected.map(fl => URL.createObjectURL(fl)));
          }}
          className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-700"
        />
        {galleryPreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {galleryPreviews.slice(0, 5).map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200">
                <img src={src} alt={`Gallery ${i + 1}`} className="h-20 w-full object-cover" />
                <p className="py-1 text-center text-[10px] text-gray-400">Image {i + 1}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {([{k:'isFeatured',l:'Featured'},{k:'isArchived',l:'Archived'},{k:'isActive',l:'Active'}] as const).map(({k,l}) => (
          <div key={k} className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">{l}</label>
            <Toggle value={f[k]} onChange={v => s(k, v)} />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-800">🏠 Show on Home Page</p>
            <p className="mt-0.5 text-xs text-blue-500">Feature in any homepage section. Slot is auto-replaced if full.</p>
          </div>
          <Toggle value={f.showOnHome} onChange={v => { s('showOnHome', v); if (!v) { s('homeSection',''); s('homeSortOrder',1); }}} />
        </div>
        {f.showOnHome && (
          <div className="grid gap-3 sm:grid-cols-2 border-t border-blue-100 pt-3">
            <div>
              <label className="label text-blue-700">Home Section *</label>
              <select value={f.homeSection} onChange={e => { s('homeSection', e.target.value); s('homeSortOrder', 1); }} className="input w-full">
                <option value="">— Select section —</option>
                {HOME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label} (max {o.max})</option>)}
              </select>
              {f.homeSection === 'hero' && (
                <p className="mt-1.5 rounded-lg bg-yellow-50 border border-yellow-100 p-2 text-xs text-yellow-800">
                  ⭐ Title, subtitle &amp; image auto-populate the hero. One "Read More" button links here.
                </p>
              )}
            </div>
            {f.homeSection && (
              <div>
                <label className="label text-blue-700">Position (1 = first, max {homeMax})</label>
                <input type="number" min={1} max={homeMax}
                  value={f.homeSortOrder}
                  onChange={e => s('homeSortOrder', Math.min(homeMax, Math.max(1, Number(e.target.value))))}
                  className="input w-full"
                />
                <p className="mt-1 text-xs text-blue-500">Occupied slot gets displaced automatically.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
        <button
          onClick={() => onSave({ ...f, hashtags: normalizeHashtags(hashTxt) }, file, galleryFiles)}
          disabled={saving || !f.title || (isVideo && !f.videoId)}
          className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Article'}
        </button>
      </div>
    </div>
  );
}

function ArticleRow({ a, onEdit, onDelete }: { a: any; onEdit: () => void; onDelete: () => void }) {
  const isVideo = a.section === 'video';
  const ytThumb = isVideo && a.videoId ? `https://img.youtube.com/vi/${a.videoId}/mqdefault.jpg` : null;
  const imgSrc  = a.imageUrl || ytThumb || '';
  const homeOpt = HOME_OPTIONS.find(o => o.value === a.homeSection);
  const galleryCount = Array.isArray(a.galleryImages) ? a.galleryImages.length : 0;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
      {imgSrc && (
        <div className="relative h-14 w-20 flex-shrink-0">
          <img src={imgSrc} className="h-full w-full rounded-xl object-cover" alt="" />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80">
                <svg className="ml-0.5 h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500 capitalize">{a.region || a.section || ''}</span>
          {a.subCategory && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{a.subCategory}</span>}
          {a.isFeatured  && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
          {a.isArchived  && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">Archived</span>}
          {galleryCount > 0 && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">📷 +{galleryCount}</span>}
          {a.showOnHome && a.homeSection === 'hero' && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">⭐ Hero #{a.homeSortOrder}</span>}
          {a.showOnHome && a.homeSection && a.homeSection !== 'hero' && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              🏠 {(homeOpt?.label||a.homeSection).replace(/\(.*\)/,'').trim()} #{a.homeSortOrder}
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {a.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
        <p className="truncate text-sm font-semibold text-gray-800">{a.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{a.category}{a.category && ' · '}{a.author}{a.author && ' · '}{a.date}</p>
        {Array.isArray(a.hashtags) && a.hashtags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {a.hashtags.slice(0,4).map((t: string) => <span key={t} className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">#{t}</span>)}
            {a.hashtags.length > 4 && <span className="text-[11px] text-gray-400">+{a.hashtags.length-4} more</span>}
          </div>
        )}
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <button onClick={onEdit}   className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
}

export function AdminAllPages() {
  const { get, post, put, del } = useAdminApi();

  const [selectedSection, setSelectedSection] = useState('');
  const cfg = ALL_SECTIONS.find(s => s.value === selectedSection);

  const [articles,   setArticles]   = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(false);

  const [search,      setSearch]      = useState('');
  const [filterHome,  setFilterHome]  = useState('');
  const [filterSub,   setFilterSub]   = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear,  setFilterYear]  = useState('');
  const [page,        setPage]        = useState(1);
  const [pageInput,   setPageInput]   = useState('1');

  const [adding,    setAdding]    = useState(false);
  const [editId,    setEditId]    = useState<string|null>(null);
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    if (!selectedSection || !cfg) { setArticles([]); setTotalCount(0); setTotalPages(1); return; }
    setLoading(true);
    try {
      const p = new URLSearchParams({ page: String(page), limit: '10', section: selectedSection, sectionType: cfg.type });
      if (search)      p.set('search',      search);
      if (filterHome)  p.set('homeSection', filterHome);
      if (filterSub)   p.set('subCategory', filterSub);
      if (filterMonth) p.set('month',       filterMonth);
      if (filterYear)  p.set('year',        filterYear);
      const data = await get(`/all-articles/admin?${p.toString()}`);
      setArticles(data.articles || []);
      setTotalCount(data.total  || 0);
      setTotalPages(data.pages  || 1);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedSection, page, search, filterHome, filterSub, filterMonth, filterYear]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); setPageInput('1'); }, [selectedSection, search, filterHome, filterSub, filterMonth, filterYear]);
  useEffect(() => { setAdding(false); setEditId(null); setSaveError(''); }, [selectedSection]);

  const apiBase = cfg?.type === 'region' ? '/region-articles' : '/section-articles';

  const toFD = (f: any, file: File | null, galleryFiles: File[] = []) => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === 'hashtags') fd.append('hashtags', JSON.stringify(v));
      else fd.append(k, String(v));
    });
    if (file) fd.append('image', file);
    galleryFiles.slice(0, 5).forEach(gf => fd.append('galleryImages', gf));
    return fd;
  };

  const handleCreate = async (f: any, file: File | null, galleryFiles: File[] = []) => {
    setSaving(true); setSaveError('');
    try {
      const payload = { ...f };
      if (cfg?.type === 'region') payload.region  = selectedSection;
      else                        payload.section = selectedSection;
      await post(apiBase, toFD(payload, file, galleryFiles));
      setAdding(false);
      await load();
    } catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleUpdate = async (f: any, file: File | null, galleryFiles: File[] = []) => {
    setSaving(true); setSaveError('');
    try {
      await put(`${apiBase}/${f._id}`, toFD(f, file, galleryFiles));
      setEditId(null);
      await load();
    } catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    try { await del(`${apiBase}/${id}`); await load(); } catch (e) { console.error(e); }
  };

  const goToPage = (p: number) => { const c = Math.max(1, Math.min(totalPages, p)); setPage(c); setPageInput(String(c)); };
  const hasSub = (cfg?.subCategories?.length ?? 0) > 0;

  return (
    <div className="space-y-5">
      <BreakingNewsManager />

      <div>
        <h2 className="text-xl font-bold text-gray-900">All Pages Handling</h2>
        <p className="text-sm text-gray-500">Manage all home sections and More section articles from one place.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <label className="label mb-2 block">Select Section to Manage</label>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="input w-full max-w-md">
          <option value="">— Choose a section —</option>
          <optgroup label="🏠 Home Featured Sections">
            {HOME_FEATURED_SECTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </optgroup>
          <optgroup label="📂 More Sections">
            {MORE_SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </optgroup>
        </select>
      </div>

      {selectedSection && cfg && (
        <>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-semibold text-gray-800">
                {cfg.label}
                <span className="ml-2 text-sm font-normal text-gray-400">{totalCount} article{totalCount !== 1 ? 's' : ''}</span>
              </h3>
              {!adding && !editId && (
                <button onClick={() => { setAdding(true); setEditId(null); setSaveError(''); }} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  + New Article
                </button>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title / author…" className="input w-full" />
              <select value={filterHome} onChange={e => setFilterHome(e.target.value)} className="input w-full">
                <option value="">All Home Placements</option>
                {HOME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label.replace(/\(.*\)/,'').trim()}</option>)}
              </select>
              {hasSub && (
                <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input w-full">
                  <option value="">All Sub-Categories</option>
                  {cfg.subCategories.map((sc: string) => <option key={sc} value={slugify(sc)}>{sc}</option>)}
                </select>
              )}
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="input w-full">
                <option value="">All Months</option>
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
              <input value={filterYear} onChange={e => setFilterYear(e.target.value)} placeholder="Year e.g. 2026" type="number" className="input w-full" />
            </div>
          </div>

          {adding && <UnifiedForm sectionConfig={cfg} onSave={handleCreate} onCancel={() => { setAdding(false); setSaveError(''); }} saving={saving} error={saveError} />}
          {loading && <div className="py-16 text-center text-gray-400">Loading…</div>}
          {!loading && articles.length === 0 && !adding && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
              <p className="font-semibold text-gray-500">No articles found</p>
              <p className="mt-1 text-sm text-gray-400">Adjust filters or click "New Article".</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="space-y-3">
              {articles.map(a =>
                editId === a._id ? (
                  <UnifiedForm key={a._id} init={a} sectionConfig={cfg} onSave={handleUpdate} onCancel={() => { setEditId(null); setSaveError(''); }} saving={saving} error={saveError} />
                ) : (
                  <ArticleRow key={a._id} a={a} onEdit={() => { setEditId(a._id); setAdding(false); setSaveError(''); }} onDelete={() => handleDelete(a._id)} />
                )
              )}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">← Prev</button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Page</span>
                <input type="number" min={1} max={totalPages} value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onBlur={() => goToPage(Number(pageInput))}
                  onKeyDown={e => e.key === 'Enter' && goToPage(Number(pageInput))}
                  className="input w-16 text-center"
                />
                <span>of {totalPages} ({totalCount} total)</span>
              </div>
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
