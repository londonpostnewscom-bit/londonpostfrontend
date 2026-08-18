


import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { RichTextEditor } from '../../components/RichTextEditor';
import { BlockEditor, Block, serializeBlocks, deserializeBlocks } from '../../components/BlockEditor';

/* ─── Section config ─────────────────────────────────────────────────── */

const WORLD_REGIONS = [
  { value: 'asia',        label: 'Asia',          type: 'region' as const, subCategories: ['East Asia','South Asia','Southeast Asia','Central Asia'], isVideo: false },
  { value: 'europe',      label: 'Europe',        type: 'region' as const, subCategories: [], isVideo: false },
  { value: 'middleeast',  label: 'Middle East',   type: 'region' as const, subCategories: [], isVideo: false },
  { value: 'americas',    label: 'Americas',      type: 'region' as const, subCategories: ['North America','Latin America & Caribbean','South America'], isVideo: false },
  { value: 'africa',      label: 'Africa',        type: 'region' as const, subCategories: [], isVideo: false },
  { value: 'russia',      label: 'Russia',        type: 'region' as const, subCategories: [], isVideo: false },
  { value: 'caucasus', label: 'Caucasus', type: 'region' as const, subCategories: ['Armenia','Georgia','Azerbaijan'], isVideo: false },
  { value: 'oceania',     label: 'Oceania',       type: 'region' as const, subCategories: [], isVideo: false },
];

const MORE_SECTIONS = [
  { value: 'interviews',        label: 'Interviews',          type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'sports',            label: 'Sports',              type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'art-culture',       label: 'Art & Culture',       type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'hidden-histories',  label: 'Hidden Histories',    type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'youth-voices',      label: 'Youth Voices',        type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'economy',           label: 'Economy',             type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'defence',           label: 'Defence',             type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'video',             label: 'Video',               type: 'section' as const, subCategories: [], isVideo: true  },
  { value: 'opinion',           label: 'Opinion',             type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'diplomatic-corner', label: 'Geopolitical Dispatch',  type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'tashkent',          label: 'Tashkent',            type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'tiif-2026',         label: 'TIIF-2026',           type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'world',             label: 'World',                type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'uk',                label: 'United Kingdom',       type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'editors-picks',     label: "Editor's Picks",       type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'in-focus',          label: 'In Focus',              type: 'section' as const, subCategories: [], isVideo: false },
  { value: 'aviation', label: 'Aviation', type: 'section' as const, subCategories: [], isVideo: false },
];

const ALL_SECTIONS = [...WORLD_REGIONS, ...MORE_SECTIONS];

const CROSS_POST_OPTIONS = [
  { value: 'world',         label: '🌐 World (Headline / Hero)' },
  { value: 'editors-picks', label: "📌 Editor's Picks" },
  { value: 'in-focus',      label: '🔍 In Focus' },
];

const MONTHS = [
  { v:'1',l:'January'  },{ v:'2', l:'February'},{ v:'3', l:'March'    },
  { v:'4',l:'April'    },{ v:'5', l:'May'      },{ v:'6', l:'June'     },
  { v:'7',l:'July'     },{ v:'8', l:'August'   },{ v:'9', l:'September'},
  { v:'10',l:'October' },{ v:'11',l:'November' },{ v:'12',l:'December' },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function normalizeHashtags(text: string): string[] {
  return [...new Set(
    text.split(',').map(t => t.trim()).filter(Boolean)
      .map(t => t.replace(/^#+/,'').replace(/\s+/g,'-').replace(/[^a-zA-Z0-9-_]/g,''))
      .filter(Boolean).slice(0,20)
  )];
}

function sectionLabel(value: string) {
  const found = ALL_SECTIONS.find(s => s.value === value);
  return found?.label || value;
}
function crossPostLabel(value: string) {
  const found = CROSS_POST_OPTIONS.find(o => o.value === value);
  return (found?.label || value).replace(/^\S+\s/, '');
}

/* ─── Toggle ─────────────────────────────────────────────────────────── */

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${value?'bg-red-600':'bg-gray-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${value?'translate-x-4':'translate-x-0.5'}`} />
    </button>
  );
}

/* ─── Duplicate title warning banner ─────────────────────────────────── */

type TitleMatch = { id: string; title: string; where: string; kind: 'region' | 'section' };

function DuplicateTitleWarning({ checking, matches }: { checking: boolean; matches: TitleMatch[] }) {
  if (!checking && matches.length === 0) return null;

  return (
    <div
      className={`mt-2 rounded-xl border px-3 py-2 text-xs ${
        checking
          ? 'border-gray-200 bg-gray-50 text-gray-400'
          : 'border-amber-200 bg-amber-50 text-amber-800'
      }`}
    >
      {checking ? (
        'Checking for duplicate titles…'
      ) : (
        <>
          <p className="font-semibold">
            ⚠️ This title already exists in {matches.length} place{matches.length !== 1 ? 's' : ''}:
          </p>
          <ul className="mt-1 space-y-0.5">
            {matches.map(m => (
              <li key={m.id}>
                • <span className="font-medium capitalize">{sectionLabel(m.where)}</span>
                {' — "'}{m.title}{'"'}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-amber-600">
            You can still save if this is intentional — this is just a heads-up.
          </p>
        </>
      )}
    </div>
  );
}

/* ─── Opinion-only: author photo resolver ────────────────────────────────
   Live-checks the typed author name against the Author collection as they
   type. Three states:
     - recognized team member  → their official photo shown, NO upload
       control offered at all (protects the official photo from being
       casually overwritten from an article form)
     - recognized contributor  → their last self-uploaded photo shown,
       with an optional re-upload to replace it
     - unrecognized name       → upload required (new contributor)
   Nothing here writes to the Author collection directly — that only
   happens in UnifiedForm's handleSave, once, right before the article
   itself saves. ─────────────────────────────────────────────────────── */

type AuthorLookup = { name: string; photoUrl: string; isTeamMember: boolean } | null;

function OpinionAuthorPhoto({
  authorName,
  photoFile,
  onPhotoFileChange,
  lookup,
  setLookup,
  checking,
  setChecking,
}: {
  authorName: string;
  photoFile: File | null;
  onPhotoFileChange: (f: File | null) => void;
  lookup: AuthorLookup;
  setLookup: (v: AuthorLookup) => void;
  checking: boolean;
  setChecking: (v: boolean) => void;
}) {
  const { get } = useAdminApi();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQueryRef = useRef(0);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const name = authorName?.trim() || '';
    if (name.length < 2) {
      setChecking(false);
      setLookup(null);
      return;
    }
    setChecking(true);
    debounceRef.current = setTimeout(async () => {
      const queryId = ++latestQueryRef.current;
      try {
        const data = await get(`/authors/lookup/${encodeURIComponent(name)}`);
        if (queryId === latestQueryRef.current) {
          setLookup(data || null);
          setChecking(false);
        }
      } catch {
        if (queryId === latestQueryRef.current) {
          setChecking(false);
          setLookup(null);
        }
      }
    }, 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorName]);

  const isTeamMember = lookup?.isTeamMember;
  const displayPhoto = preview || (isTeamMember ? lookup?.photoUrl : photoFile ? preview : lookup?.photoUrl);

  return (
    <div className="sm:col-span-2 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <label className="label mb-2 block">Author Photo</label>

      {checking && <p className="text-xs text-gray-400">Checking author…</p>}

      {!checking && isTeamMember && (
        <div className="flex items-center gap-3">
          {lookup?.photoUrl ? (
            <img src={lookup.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-400">
              {authorName.charAt(0)}
            </div>
          )}
          <p className="text-xs text-green-700 font-medium">
            ✓ Recognized team member — official photo is used automatically. No upload needed.
          </p>
        </div>
      )}

      {!checking && !isTeamMember && lookup && (
        <div className="flex items-start gap-3">
          {displayPhoto ? (
            <img src={displayPhoto} alt="" className="h-14 w-14 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-400">
              {authorName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">
              Known contributor — using their last uploaded photo. Optionally replace it below.
            </p>
            <input
              type="file" accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { onPhotoFileChange(f); setPreview(URL.createObjectURL(f)); }
              }}
              className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
            />
          </div>
        </div>
      )}

      {!checking && !lookup && authorName?.trim().length >= 2 && (
        <div className="flex items-start gap-3">
          {displayPhoto ? (
            <img src={displayPhoto} alt="" className="h-14 w-14 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-400">
              {authorName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs text-amber-600 mb-1.5">
              New contributor — a photo is required for this author's first Opinion piece.
            </p>
            <input
              type="file" accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { onPhotoFileChange(f); setPreview(URL.createObjectURL(f)); }
              }}
              className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
            />
          </div>
        </div>
      )}

      {!authorName?.trim() && (
        <p className="text-xs text-gray-400">Type the author's name above first.</p>
      )}
    </div>
  );
}

/* ─── Unified Article Form ───────────────────────────────────────────── */

type SectionConfig = typeof ALL_SECTIONS[0];

const FORM_EMPTY = {
  title:'', subtitle:'', content:'', author:'', date:'', category:'',
  subCategory:'', hashtags:[] as string[], isFeatured:false, isArchived:false,
  isActive:true, sortOrder:0, videoId:'',
};

function UnifiedForm({
  init, sectionConfig, onSave, onCancel, saving, error,
}: {
  init?: any;
  sectionConfig: SectionConfig;
  onSave: (data: any, file: File | null, blockFiles: { fieldname: string; file: File }[]) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const { get, post } = useAdminApi();

  const [f, setF]       = useState<any>({ ...FORM_EMPTY, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPrev] = useState(init?.imageUrl || '');
  const [hashTxt, setHT]   = useState(Array.isArray(init?.hashtags) ? init.hashtags.join(', ') : '');
  const [blocks, setBlocks] = useState<Block[]>(() => deserializeBlocks(init?.blocks || []));
  const [crossPost, setCrossPost] = useState<string[]>(
    Array.isArray(init?.crossPost) ? init.crossPost : []
  );

  const isOpinion = sectionConfig.value === 'opinion';
  const [authorLookup, setAuthorLookup] = useState<AuthorLookup>(null);
  const [authorChecking, setAuthorChecking] = useState(false);
  const [authorPhotoFile, setAuthorPhotoFile] = useState<File | null>(null);
  const [uploadingAuthorPhoto, setUploadingAuthorPhoto] = useState(false);

  /* ─── Duplicate title detection (live, debounced, across ALL sections) ─── */
  const [titleChecking, setTitleChecking] = useState(false);
  const [titleMatches, setTitleMatches]   = useState<TitleMatch[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestQueryRef = useRef(0);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const title = f.title?.trim() || '';
    if (title.length < 3) {
      setTitleChecking(false);
      setTitleMatches([]);
      return;
    }

    setTitleChecking(true);
    debounceRef.current = setTimeout(async () => {
      const queryId = ++latestQueryRef.current;
      try {
        const params = new URLSearchParams({ title });
        if (init?._id) params.set('excludeId', init._id);
        const data = await get(`/all-articles/check-title?${params.toString()}`);
        if (queryId === latestQueryRef.current) {
          setTitleMatches(data.matches || []);
          setTitleChecking(false);
        }
      } catch {
        if (queryId === latestQueryRef.current) {
          setTitleChecking(false);
          setTitleMatches([]);
        }
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.title]);

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const subCats = sectionConfig.subCategories || [];
  const hasPredefinedSubCats = subCats.length > 0;
  const isVideo = sectionConfig.isVideo;
  const ytThumb = isVideo && f.videoId ? `https://img.youtube.com/vi/${f.videoId}/maxresdefault.jpg` : null;
  const hashTags = normalizeHashtags(hashTxt);

  const toggleCrossPost = (value: string) => {
    setCrossPost(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleSave = async () => {
    // Opinion-only: if this is a brand-new or updated contributor photo,
    // save it to the Author collection FIRST. This never touches team
    // members (the backend silently no-ops if the name is a team member),
    // and never touches the article document itself — resolution happens
    // live by name at display time instead.
    if (isOpinion && authorPhotoFile && f.author?.trim() && !authorLookup?.isTeamMember) {
      setUploadingAuthorPhoto(true);
      try {
        const afd = new FormData();
        afd.append('name', f.author.trim());
        afd.append('photo', authorPhotoFile);
        await post('/authors/contributor', afd);
      } catch (e) {
        console.error('Failed to save contributor photo', e);
      }
      setUploadingAuthorPhoto(false);
    }

    const { json: blocksJson, files: blockFiles } = serializeBlocks(blocks);
    onSave({ ...f, hashtags: normalizeHashtags(hashTxt), blocks: blocksJson, crossPost: JSON.stringify(crossPost) }, file, blockFiles);
  };

  const opinionPhotoMissing =
    isOpinion &&
    f.author?.trim().length >= 2 &&
    !authorChecking &&
    !authorLookup &&
    !authorPhotoFile;

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
          <DuplicateTitleWarning checking={titleChecking} matches={titleMatches} />
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
          <label className="label">Date</label>
          <input value={f.date} onChange={e => s('date', e.target.value)} placeholder="e.g. July 21, 2026" className="input w-full" />
          <p className="mt-1 text-[11px] text-gray-400">This drives automatic newest-first sorting everywhere.</p>
        </div>

        {isOpinion && (
          <OpinionAuthorPhoto
            authorName={f.author || ''}
            photoFile={authorPhotoFile}
            onPhotoFileChange={setAuthorPhotoFile}
            lookup={authorLookup}
            setLookup={setAuthorLookup}
            checking={authorChecking}
            setChecking={setAuthorChecking}
          />
        )}

        <div>
          <label className="label">Category</label>
          <input value={f.category} onChange={e => s('category', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Sort Order (within this section's own listing page)</label>
          <input type="number" value={f.sortOrder} onChange={e => s('sortOrder', Number(e.target.value))} className="input w-full" />
        </div>

        {/* Sub-Category — predefined list where one exists, free-text otherwise */}
        <div className="sm:col-span-2">
          <label className="label">Sub-Category</label>
          {hasPredefinedSubCats ? (
            <select value={f.subCategory} onChange={e => s('subCategory', e.target.value)} className="input w-full">
              <option value="">— All of {sectionConfig.label} —</option>
              {subCats.map((sc: string) => <option key={sc} value={slugify(sc)}>{sc}</option>)}
            </select>
          ) : (
            <input
              value={f.subCategory}
              onChange={e => s('subCategory', e.target.value)}
              placeholder="Optional — e.g. a tag to group related articles"
              className="input w-full"
            />
          )}
        </div>

        {/* Cross-post — the ONLY manual home-page action. This section's own
            home block (if any) is already automatic — no checkbox needed for it. */}
        <div className="sm:col-span-2">
          <label className="label">Also show this article in</label>
          <div className="flex flex-wrap gap-3">
            {CROSS_POST_OPTIONS.map(opt => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                  crossPost.includes(opt.value) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={crossPost.includes(opt.value)}
                  onChange={() => toggleCrossPost(opt.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            This article already shows automatically in {sectionConfig.label}'s own home block — check these only if you also want it in World, Editor's Picks, or In Focus.
          </p>
        </div>

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
          <input value={hashTxt} onChange={e => setHT(e.target.value)} placeholder="politics, diplomacy" className="input w-full" />
          {hashTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {hashTags.map(t => <span key={t} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">#{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Cover image — hidden entirely for Opinion, since Opinion pieces no
          longer use a cover image at all (author photo replaces it visually). */}
      {!isOpinion && (
        <div>
          <label className="label">Cover Image {isVideo ? '(optional)' : ''}</label>
          <div className="flex flex-wrap items-center gap-3">
            {preview && <img src={preview} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-200" />}
            <input type="file" accept="image/*"
              onChange={e => { const fl = e.target.files?.[0]; if (fl) { setFile(fl); setPrev(URL.createObjectURL(fl)); }}}
              className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">This is the main cover image shown in listings and at the top of the article.</p>
        </div>
      )}

      {/* Block editor */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Article Content & Images</label>
          <span className="text-[10px] text-gray-400">{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
        </div>
        <p className="mb-3 text-xs text-gray-400">
          Build your article by adding text and image blocks in any order. Click + between blocks to insert.
        </p>
        <BlockEditor value={blocks} onChange={setBlocks} />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        {([{k:'isFeatured',l:'Featured'},{k:'isArchived',l:'Archived'},{k:'isActive',l:'Active'}] as const).map(({k,l}) => (
          <div key={k} className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">{l}</label>
            <Toggle value={f[k]} onChange={v => s(k, v)} />
          </div>
        ))}
      </div>

      {isOpinion && opinionPhotoMissing && (
        <p className="text-xs text-amber-600">
          ⚠️ This author needs a photo before saving — scroll up to the Author Photo field.
        </p>
      )}

      <div className="flex gap-3 justify-end pt-1">
        <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave}
          disabled={saving || uploadingAuthorPhoto || !f.title || (isVideo && !f.videoId) || opinionPhotoMissing}
          className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {saving || uploadingAuthorPhoto ? 'Saving…' : 'Save Article'}
        </button>
      </div>
    </div>
  );
}

/* ─── Article Row ────────────────────────────────────────────────────── */

function ArticleRow({ a, onEdit, onDelete }: { a: any; onEdit: () => void; onDelete: () => void }) {
  const isVideo  = a.section === 'video';
  const ytThumb  = isVideo && a.videoId ? `https://img.youtube.com/vi/${a.videoId}/mqdefault.jpg` : null;
  const imgSrc   = a.imageUrl || ytThumb || '';
  const sLabel   = a.region || a.section || '';
  const crossPost: string[] = Array.isArray(a.crossPost) ? a.crossPost : [];

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
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500 capitalize">{sLabel}</span>
          {a.isFeatured  && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
          {a.isArchived  && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">Archived</span>}
          {crossPost.map(v => (
            <span key={v} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              🏠 {crossPostLabel(v)}
            </span>
          ))}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {a.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>

        <p className="truncate text-sm font-semibold text-gray-800">{a.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{a.category}{a.category && ' · '}{a.author}{a.author && ' · '}{a.date}</p>

        {Array.isArray(a.hashtags) && a.hashtags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {a.hashtags.slice(0,4).map((t: string) => (
              <span key={t} className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600">#{t}</span>
            ))}
            {a.hashtags.length > 4 && <span className="text-[11px] text-gray-400">+{a.hashtags.length-4} more</span>}
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 gap-2">
        <button onClick={onEdit}   className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="rounded-lg border border-red-100  px-3 py-1.5 text-xs text-red-600  hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────── */

export function AdminAllPages() {
  const { get, post, put, del } = useAdminApi();

  const [selectedSection, setSelectedSection] = useState('');
  const cfg = ALL_SECTIONS.find(s => s.value === selectedSection);

  const [articles,    setArticles]    = useState<any[]>([]);
  const [totalCount,  setTotalCount]  = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(false);

  const [search,       setSearch]      = useState('');
  const [filterHome,   setFilterHome]  = useState('');
  const [filterSub,    setFilterSub]   = useState('');
  const [filterMonth,  setFilterMonth] = useState('');
  const [filterYear,   setFilterYear]  = useState('');
  const [page,         setPage]        = useState(1);
  const [pageInput,    setPageInput]   = useState('1');

  const [adding,     setAdding]    = useState(false);
  const [editId,     setEditId]    = useState<string|null>(null);
  const [saving,     setSaving]    = useState(false);
  const [saveError,  setSaveError] = useState('');

  const load = useCallback(async () => {
    if (!selectedSection || !cfg) { setArticles([]); setTotalCount(0); setTotalPages(1); return; }
    setLoading(true);
    try {
      const p = new URLSearchParams({
        page:        String(page),
        limit:       '10',
        section:     selectedSection,
        sectionType: cfg.type,
      });
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

  // Reset the sub-category filter whenever the SECTION changes.
  useEffect(() => { setPage(1); setPageInput('1'); setFilterSub(''); }, [selectedSection]);
  useEffect(() => { setPage(1); setPageInput('1'); }, [search, filterHome, filterSub, filterMonth, filterYear]);

  useEffect(() => { setAdding(false); setEditId(null); setSaveError(''); }, [selectedSection]);

  const apiBase = cfg?.type === 'region' ? '/region-articles' : '/section-articles';

  const toFD = (f: any, file: File | null, blockFiles: { fieldname: string; file: File }[] = []) => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (k === 'hashtags') fd.append('hashtags', JSON.stringify(v));
      else if (k === 'blocks') fd.append('blocks', String(v));
      else if (k === 'crossPost') fd.append('crossPost', String(v));
      else fd.append(k, String(v));
    });
    if (file) fd.append('image', file);
    blockFiles.forEach(({ fieldname, file }) => fd.append(fieldname, file));
    return fd;
  };

  const handleCreate = async (f: any, file: File | null, blockFiles: { fieldname: string; file: File }[]) => {
    setSaving(true); setSaveError('');
    try {
      const payload = { ...f };
      if (cfg?.type === 'region') payload.region  = selectedSection;
      else                        payload.section = selectedSection;
      await post(apiBase, toFD(payload, file, blockFiles));
      setAdding(false);
      await load();
    } catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleUpdate = async (f: any, file: File | null, blockFiles: { fieldname: string; file: File }[]) => {
    setSaving(true); setSaveError('');
    try {
      await put(`${apiBase}/${f._id}`, toFD(f, file, blockFiles));
      setEditId(null);
      await load();
    } catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    try { await del(`${apiBase}/${id}`); await load(); }
    catch (e) { console.error(e); }
  };

  const goToPage = (p: number) => {
    const c = Math.max(1, Math.min(totalPages, p));
    setPage(c); setPageInput(String(c));
  };

  const hasSub = (cfg?.subCategories?.length ?? 0) > 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">All Pages Handling</h2>
        <p className="text-sm text-gray-500">Region and More sections — Central Asia, UK, Europe, etc. show automatically; only World / Editor's Picks / In Focus need a manual checkbox.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <label className="label mb-2 block">Select Page / Section</label>
        <select
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
          className="input w-full max-w-sm"
        >
          <option value="">— Choose a section to manage —</option>
          <optgroup label="🌍 Region">
            {WORLD_REGIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
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
                <button
                  onClick={() => { setAdding(true); setEditId(null); setSaveError(''); }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  + New Article
                </button>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search title / author / category…"
                className="input w-full"
              />
              <select value={filterHome} onChange={e => setFilterHome(e.target.value)} className="input w-full">
                <option value="">All Cross-Posts</option>
                {CROSS_POST_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label.replace(/^\S+\s/, '')}</option>
                ))}
              </select>
              {hasSub && (
                <select value={filterSub} onChange={e => setFilterSub(e.target.value)} className="input w-full">
                  <option value="">All Sub-Categories</option>
                  {cfg.subCategories.map((sc: string) => (
                    <option key={sc} value={slugify(sc)}>{sc}</option>
                  ))}
                </select>
              )}
              <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="input w-full">
                <option value="">All Months</option>
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
              <input
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                placeholder="Year e.g. 2026"
                type="number"
                className="input w-full"
              />
            </div>
          </div>

          {adding && (
            <UnifiedForm
              sectionConfig={cfg}
              onSave={handleCreate}
              onCancel={() => { setAdding(false); setSaveError(''); }}
              saving={saving}
              error={saveError}
            />
          )}

          {loading && <div className="py-16 text-center text-gray-400">Loading…</div>}

          {!loading && articles.length === 0 && !adding && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
              <p className="font-semibold text-gray-500">No articles found</p>
              <p className="mt-1 text-sm text-gray-400">Adjust filters or click "New Article" above.</p>
            </div>
          )}

          {!loading && articles.length > 0 && (
            <div className="space-y-3">
              {articles.map(a =>
                editId === a._id ? (
                  <UnifiedForm
                    key={a._id}
                    init={a}
                    sectionConfig={cfg}
                    onSave={handleUpdate}
                    onCancel={() => { setEditId(null); setSaveError(''); }}
                    saving={saving}
                    error={saveError}
                  />
                ) : (
                  <ArticleRow
                    key={a._id}
                    a={a}
                    onEdit={() => { setEditId(a._id); setAdding(false); setSaveError(''); }}
                    onDelete={() => handleDelete(a._id)}
                  />
                )
              )}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Page</span>
                <input
                  type="number" min={1} max={totalPages}
                  value={pageInput}
                  onChange={e => setPageInput(e.target.value)}
                  onBlur={() => goToPage(Number(pageInput))}
                  onKeyDown={e => e.key === 'Enter' && goToPage(Number(pageInput))}
                  className="input w-16 text-center"
                />
                <span>of {totalPages}</span>
                <span className="text-gray-400">({totalCount} total)</span>
              </div>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
