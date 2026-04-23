

// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAdminApi } from '../../hooks/useAdminApi';
// import { useAdminArticleFilter } from '../../hooks/useAdminArticleFilter';
// import { RichTextEditor } from '../../components/RichTextEditor';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const SECTION_CONFIG: Record<string, string> = {
//   'interviews':        'Interviews',
//   'art-culture':       'Art & Culture',
//   'sports':            'Sports',
//   'hidden-histories':  'Hidden Histories',
//   'youth-voices':      'Youth Voices',
//   'economy':           'Economy',
//   'defence':           'Defence',
//   'video':             'Video',
//   'opinion':           'Opinion',
//   'diplomatic-corner': 'Diplomatic Corner',
// };

// // Sections with their own dedicated home block
// const OWN_HOME_SECTIONS = ['interviews', 'video', 'opinion', 'diplomatic-corner'];

// // Sections that can show on home via existing home blocks
// const HOME_TARGET_OPTIONS = [
//   { value: 'uk',            label: 'United Kingdom' },
//   { value: 'editors-picks', label: "Editor's Picks" },
//   { value: 'in-focus',      label: 'In Focus' },
// ];

// const EMPTY: any = {
//   title: '', subtitle: '', content: '', author: '', date: '',
//   category: '', isFeatured: false, isArchived: false, isActive: true,
//   sortOrder: 0, showOnHome: false, homeSortOrder: 1, homeSection: '', videoId: '',
// };

// function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
//   return (
//     <button
//       onClick={() => onChange(!value)}
//       className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${value ? 'bg-red-600' : 'bg-gray-300'}`}
//     >
//       <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
//     </button>
//   );
// }

// function Form({ init, section, homeCount, onSave, onCancel, saving, error }: any) {
//   const [f, setF] = useState<any>({ ...EMPTY, section, ...(init || {}) });
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState(init?.imageUrl || '');
//   const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

//   const isVideo = section === 'video';
//   const hasOwnBlock = OWN_HOME_SECTIONS.includes(section);
//   const maxHomeSlots = section === 'diplomatic-corner' ? 8 : 4;

//   const remaining = maxHomeSlots - (homeCount || 0);
//   const canShowHome = remaining > 0 || f.showOnHome;

//   // YouTube thumbnail preview
//   const ytThumb = isVideo && f.videoId
//     ? `https://img.youtube.com/vi/${f.videoId}/maxresdefault.jpg`
//     : null;

//   return (
//     <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
//       <h3 className="border-b border-gray-100 pb-3 text-base font-semibold text-gray-800">
//         {init?._id ? 'Edit Article' : 'New Article'}
//       </h3>

//       {error && (
//         <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
//           {error}
//         </div>
//       )}

//       <div className="grid gap-4 sm:grid-cols-2">
//         <div className="sm:col-span-2">
//           <label className="label">Title *</label>
//           <input value={f.title} onChange={(e) => s('title', e.target.value)} className="input w-full" />
//         </div>

//         <div className="sm:col-span-2">
//           <label className="label">Subtitle</label>
//           <input value={f.subtitle} onChange={(e) => s('subtitle', e.target.value)} className="input w-full" />
//         </div>

//         <div>
//           <label className="label">Author</label>
//           <input value={f.author} onChange={(e) => s('author', e.target.value)} className="input w-full" />
//         </div>

//         <div>
//           <label className="label">Date (e.g. April 17, 2026)</label>
//           <input value={f.date} onChange={(e) => s('date', e.target.value)} className="input w-full" />
//         </div>

//         <div>
//           <label className="label">Category</label>
//           <input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" />
//         </div>

//         <div>
//           <label className="label">Sort Order (lower = first)</label>
//           <input
//             type="number"
//             value={f.sortOrder}
//             onChange={(e) => s('sortOrder', Number(e.target.value))}
//             className="input w-full"
//           />
//         </div>

//         {/* YouTube Video ID — video section only */}
//         {isVideo && (
//           <div className="sm:col-span-2">
//             <label className="label">YouTube Video ID *</label>
//             <input
//               value={f.videoId}
//               onChange={(e) => s('videoId', e.target.value.trim())}
//               placeholder="e.g. dQw4w9WgXcQ (from youtube.com/watch?v=THIS)"
//               className="input w-full"
//             />
//             {ytThumb && (
//               <div className="mt-3 relative overflow-hidden rounded-xl w-48">
//                 <img src={ytThumb} alt="YouTube thumbnail" className="w-full rounded-xl object-cover" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90">
//                     <svg className="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M8 5v14l11-7z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <p className="mt-1 text-xs text-gray-400">
//               Thumbnail is auto-generated from YouTube. Upload a cover image below to override it.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       <div>
//         <label className="label">
//           {isVideo ? 'Video Description / Article Content' : 'Full Article Content (bold, headings, lists — paste from anywhere)'}
//         </label>
//         <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
//       </div>

//       {/* Cover Image */}
//       <div>
//         <label className="label">Cover Image {isVideo ? '(optional — overrides YouTube thumbnail)' : ''}</label>
//         <div className="flex flex-wrap items-center gap-3">
//           {preview && <img src={preview} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-200" />}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const fl = e.target.files?.[0];
//               if (fl) {
//                 setFile(fl);
//                 setPreview(URL.createObjectURL(fl));
//               }
//             }}
//             className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
//           />
//         </div>
//       </div>

//       {/* Toggles */}
//       <div className="flex flex-wrap gap-6">
//         {[
//           { key: 'isFeatured', label: 'Featured' },
//           { key: 'isArchived', label: 'Archived' },
//           { key: 'isActive', label: 'Active' },
//         ].map(({ key, label }) => (
//           <div key={key} className="flex items-center gap-2">
//             <label className="text-xs font-medium text-gray-600">{label}</label>
//             <Toggle value={f[key]} onChange={(v) => s(key, v)} />
//           </div>
//         ))}
//       </div>

//       {/* Show on Home */}
//       <div className={`rounded-xl border p-4 space-y-3 ${hasOwnBlock ? 'border-blue-100 bg-blue-50/60' : 'border-violet-100 bg-violet-50/60'}`}>
//         <div className="flex items-center justify-between">
//           <div>
//             <p className={`text-sm font-semibold ${hasOwnBlock ? 'text-blue-800' : 'text-violet-800'}`}>
//               🏠 Show on Home Page
//             </p>
//             <p className={`text-xs mt-0.5 ${hasOwnBlock ? 'text-blue-500' : 'text-violet-500'}`}>
//               {hasOwnBlock
//                 ? `Appears in the "${SECTION_CONFIG[section]}" block on home (max ${maxHomeSlots}).`
//                 : 'Feature this article in one of the existing home sections (max 4 per section).'}
//               {!f.showOnHome && canShowHome && ` ${remaining} slot${remaining !== 1 ? 's' : ''} remaining.`}
//               {!canShowHome && !f.showOnHome && ' ⚠ No slots remaining. Remove one first.'}
//             </p>
//           </div>

//           <Toggle
//             value={f.showOnHome}
//             onChange={(v) => {
//               if (!canShowHome && v) return;
//               s('showOnHome', v);
//               if (!v) s('homeSection', '');
//             }}
//           />
//         </div>

//         {f.showOnHome && !hasOwnBlock && (
//           <div className="grid gap-3 sm:grid-cols-2 border-t border-violet-100 pt-3">
//             <div>
//               <label className="label text-violet-700">Home Section *</label>
//               <select
//                 value={f.homeSection}
//                 onChange={(e) => s('homeSection', e.target.value)}
//                 className="input w-full"
//               >
//                 <option value="">— Select section —</option>
//                 {HOME_TARGET_OPTIONS.map((opt) => (
//                   <option key={opt.value} value={opt.value}>{opt.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label text-violet-700">Position (1 = first, max 4)</label>
//               <input
//                 type="number"
//                 min={1}
//                 max={4}
//                 value={f.homeSortOrder}
//                 onChange={(e) => s('homeSortOrder', Number(e.target.value))}
//                 className="input w-full"
//               />
//             </div>
//           </div>
//         )}

//         {f.showOnHome && hasOwnBlock && (
//           <div className="border-t border-blue-100 pt-3">
//             <label className="label text-blue-700">Position (1 = first shown, max {maxHomeSlots})</label>
//             <input
//               type="number"
//               min={1}
//               max={maxHomeSlots}
//               value={f.homeSortOrder}
//               onChange={(e) => s('homeSortOrder', Number(e.target.value))}
//               className="input w-40"
//             />
//           </div>
//         )}
//       </div>

//       <div className="flex gap-3 justify-end pt-1">
//         {onCancel && (
//           <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
//             Cancel
//           </button>
//         )}
//         <button
//           onClick={() => onSave(f, file)}
//           disabled={saving || !f.title || (section === 'video' && !f.videoId)}
//           className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
//         >
//           {saving ? 'Saving...' : 'Save Article'}
//         </button>
//       </div>
//     </div>
//   );
// }

// function Row({ a, section, onEdit, onDelete }: any) {
//   const isVideo = section === 'video';
//   const ytThumb = isVideo && a.videoId ? `https://img.youtube.com/vi/${a.videoId}/mqdefault.jpg` : null;
//   const imgSrc = a.imageUrl || ytThumb || '';

//   return (
//     <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
//       {imgSrc && (
//         <div className="relative h-14 w-20 flex-shrink-0">
//           <img src={imgSrc} className="h-full w-full rounded-xl object-cover" alt="" />
//           {isVideo && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80">
//                 <svg className="h-2.5 w-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       <div className="flex-1 min-w-0">
//         <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
//           <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">#{a.sortOrder}</span>
//           {a.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
//           {a.isArchived && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">Archived</span>}
//           {a.showOnHome && (
//             <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
//               🏠 Home #{a.homeSortOrder}
//             </span>
//           )}
//           {isVideo && a.videoId && (
//             <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">▶ {a.videoId}</span>
//           )}
//           <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
//             {a.isActive ? 'Active' : 'Hidden'}
//           </span>
//         </div>

//         <p className="font-semibold text-gray-800 truncate text-sm">{a.title}</p>
//         <p className="text-xs text-gray-400 mt-0.5">{a.category} · {a.author} · {a.date}</p>
//       </div>

//       <div className="flex gap-2 flex-shrink-0">
//         <button onClick={onEdit} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
//           Edit
//         </button>
//         <button onClick={onDelete} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// export function AdminMoreSections() {
//   const { section = 'interviews' } = useParams<{ section: string }>();
//   const label = SECTION_CONFIG[section] || section;
//   const hasOwnBlock = OWN_HOME_SECTIONS.includes(section);
//   const maxHomeSlots = section === 'diplomatic-corner' ? 8 : 4;
//   const { get, post, put, del } = useAdminApi();

//   const [articles, setArticles] = useState<any[]>([]);
//   const { filtered: filteredArticles, filterBar } = useAdminArticleFilter(articles);
//   const [homeCount, setHomeCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState('');

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await get(`/section-articles/admin/all?section=${section}`);
//       setArticles(data);

//       if (hasOwnBlock) {
//         const res = await fetch(`${API_URL}/section-articles/home-count/${section}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('lp_admin_token')}` },
//         });
//         const countData = await res.json();
//         setHomeCount(countData.count || 0);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     setAdding(false);
//     setEditId(null);
//     setSaveError('');
//     load();
//   }, [section]);

//   const toFD = (f: any, file: File | null) => {
//     const fd = new FormData();
//     Object.entries(f).forEach(([k, v]) => {
//       if (v !== undefined && v !== null) fd.append(k, String(v));
//     });
//     if (file) fd.append('image', file);
//     return fd;
//   };

//   const onCreate = async (f: any, file: File | null) => {
//     setSaving(true);
//     setSaveError('');
//     try {
//       await post('/section-articles', toFD({ ...f, section }, file));
//       setAdding(false);
//       await load();
//     } catch (e: any) {
//       setSaveError(e.message || 'Failed to save.');
//     }
//     setSaving(false);
//   };

//   const onUpdate = async (f: any, file: File | null) => {
//     setSaving(true);
//     setSaveError('');
//     try {
//       await put(`/section-articles/${f._id}`, toFD(f, file));
//       setEditId(null);
//       await load();
//     } catch (e: any) {
//       setSaveError(e.message || 'Failed to save.');
//     }
//     setSaving(false);
//   };

//   const onDelete = async (id: string) => {
//     if (!confirm('Delete this article permanently?')) return;
//     try {
//       await del(`/section-articles/${id}`);
//       await load();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">{label}</h2>
//           <p className="text-sm text-gray-500">
//             Manage articles for the {label} page.
//             {hasOwnBlock && ` Up to ${section === 'diplomatic-corner' ? 8 : 4} can appear on the home page (${homeCount}/${section === 'diplomatic-corner' ? 8 : 4} used).`}
//             {!hasOwnBlock && ' Toggle "Show on Home Page" to feature in an existing home section.'}
//           </p>
//         </div>

//         {!adding && (
//           <button
//             onClick={() => { setAdding(true); setEditId(null); setSaveError(''); }}
//             className="flex-shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
//           >
//             + New Article
//           </button>
//         )}
//       </div>

//       {hasOwnBlock && (
//         <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
//           <div className="flex items-center gap-3">
//             <div className="flex gap-1">
//               {Array.from({ length: section === 'diplomatic-corner' ? 8 : 4 }).map((_, n) => (
//                 <div
//                   key={n}
//                   className={`h-3 w-6 rounded-full ${n < homeCount ? 'bg-blue-500' : 'bg-blue-200'}`}
//                 />
//               ))}
//             </div>
//             <p className="text-sm font-medium text-blue-700">
//               {homeCount}/{section === 'diplomatic-corner' ? 8 : 4} slots used on home page
//             </p>
//           </div>
//         </div>
//       )}

//       {adding && (
//         <Form
//           section={section}
//           homeCount={homeCount}
//           onSave={onCreate}
//           onCancel={() => { setAdding(false); setSaveError(''); }}
//           saving={saving}
//           error={saveError}
//         />
//       )}

//       {loading && <div className="py-16 text-center text-gray-400">Loading...</div>}

//       {!loading && articles.length === 0 && !adding && (
//         <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
//           <p className="text-base font-semibold text-gray-500">No articles yet for {label}</p>
//           <p className="mt-1 text-sm text-gray-400">Click "New Article" to get started.</p>
//         </div>
//       )}

//       {!loading && articles.length > 0 && filterBar}

//       {!loading && (
//         <div className="space-y-3">
//           {filteredArticles.length === 0 && !adding ? (
//             <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
//               <p className="text-sm font-medium">No articles match your filter.</p>
//             </div>
//           ) : (
//             filteredArticles.map((a) =>
//               editId === a._id ? (
//                 <Form
//                   key={a._id}
//                   init={a}
//                   section={section}
//                   homeCount={homeCount}
//                   onSave={onUpdate}
//                   onCancel={() => { setEditId(null); setSaveError(''); }}
//                   saving={saving}
//                   error={saveError}
//                 />
//               ) : (
//                 <Row
//                   key={a._id}
//                   a={a}
//                   section={section}
//                   onEdit={() => { setEditId(a._id); setAdding(false); setSaveError(''); }}
//                   onDelete={() => onDelete(a._id)}
//                 />
//               )
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminApi } from '../../hooks/useAdminApi';
import { useAdminArticleFilter } from '../../hooks/useAdminArticleFilter';
import { RichTextEditor } from '../../components/RichTextEditor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SECTION_CONFIG: Record<string, string> = {
  interviews: 'Interviews',
  'art-culture': 'Art & Culture',
  sports: 'Sports',
  'hidden-histories': 'Hidden Histories',
  'youth-voices': 'Youth Voices',
  economy: 'Economy',
  defence: 'Defence',
  video: 'Video',
  opinion: 'Opinion',
  'diplomatic-corner': 'Diplomatic Corner',
};

const OWN_HOME_SECTIONS = ['interviews', 'video', 'opinion', 'diplomatic-corner'];

const HOME_TARGET_OPTIONS = [
  { value: 'uk',            label: 'United Kingdom' },
  { value: 'editors-picks', label: "Editor's Picks" },
  { value: 'in-focus',      label: 'In Focus' },
];

const EMPTY: any = {
  title: '',
  subtitle: '',
  content: '',
  author: '',
  date: '',
  category: '',
  hashtags: [],
  isFeatured: false,
  isArchived: false,
  isActive: true,
  sortOrder: 0,
  showOnHome: false,
  homeSortOrder: 1,
  homeSection: '',
  videoId: '',
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${value ? 'bg-red-600' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function normalizeHashtagsInput(text: string) {
  return [...new Set(
    text
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => tag.replace(/^#+/, ''))
      .map((tag) => tag.replace(/\s+/g, '-'))
      .map((tag) => tag.replace(/[^a-zA-Z0-9-_]/g, ''))
      .filter(Boolean)
      .slice(0, 20)
  )];
}

function Form({ init, section, homeCount, onSave, onCancel, saving, error }: any) {
  const [f, setF] = useState<any>({ ...EMPTY, section, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(init?.imageUrl || '');
  const [hashtagsText, setHashtagsText] = useState(
    Array.isArray(init?.hashtags) ? init.hashtags.join(', ') : ''
  );

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const isVideo = section === 'video';
  const hasOwnBlock = OWN_HOME_SECTIONS.includes(section);
  const maxHomeSlots = section === 'diplomatic-corner' ? 8 : 4;

  const remaining = maxHomeSlots - (homeCount || 0);
  const canShowHome = remaining > 0 || f.showOnHome;

  const ytThumb = isVideo && f.videoId
    ? `https://img.youtube.com/vi/${f.videoId}/maxresdefault.jpg`
    : null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
      <h3 className="border-b border-gray-100 pb-3 text-base font-semibold text-gray-800">
        {init?._id ? 'Edit Article' : 'New Article'}
      </h3>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Title *</label>
          <input value={f.title} onChange={(e) => s('title', e.target.value)} className="input w-full" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Subtitle</label>
          <input value={f.subtitle} onChange={(e) => s('subtitle', e.target.value)} className="input w-full" />
        </div>

        <div>
          <label className="label">Author</label>
          <input value={f.author} onChange={(e) => s('author', e.target.value)} className="input w-full" />
        </div>

        <div>
          <label className="label">Date (e.g. April 17, 2026)</label>
          <input value={f.date} onChange={(e) => s('date', e.target.value)} className="input w-full" />
        </div>

        <div>
          <label className="label">Category</label>
          <input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" />
        </div>

        <div>
          <label className="label">Sort Order (lower = first)</label>
          <input
            type="number"
            value={f.sortOrder}
            onChange={(e) => s('sortOrder', Number(e.target.value))}
            className="input w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Hashtags</label>
          <input
            value={hashtagsText}
            onChange={(e) => setHashtagsText(e.target.value)}
            placeholder="Example: sports, football, premier-league"
            className="input w-full"
          />
          <p className="mt-1 text-xs text-gray-400">
            Separate hashtags with commas. # is optional.
          </p>

          {normalizeHashtagsInput(hashtagsText).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {normalizeHashtagsInput(hashtagsText).map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {isVideo && (
          <div className="sm:col-span-2">
            <label className="label">YouTube Video ID *</label>
            <input
              value={f.videoId}
              onChange={(e) => s('videoId', e.target.value.trim())}
              placeholder="e.g. dQw4w9WgXcQ"
              className="input w-full"
            />

            {ytThumb && (
              <div className="mt-3 relative overflow-hidden rounded-xl w-48">
                <img src={ytThumb} alt="YouTube thumbnail" className="w-full rounded-xl object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/90">
                    <svg className="h-4 w-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-1 text-xs text-gray-400">
              Thumbnail is auto-generated from YouTube. Upload a cover image below to override it.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="label">
          {isVideo ? 'Video Description / Article Content' : 'Full Article Content (bold, headings, lists — paste from anywhere)'}
        </label>
        <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
      </div>

      <div>
        <label className="label">Cover Image {isVideo ? '(optional — overrides YouTube thumbnail)' : ''}</label>
        <div className="flex flex-wrap items-center gap-3">
          {preview && <img src={preview} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-200" />}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const fl = e.target.files?.[0];
              if (fl) {
                setFile(fl);
                setPreview(URL.createObjectURL(fl));
              }
            }}
            className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {[
          { key: 'isFeatured', label: 'Featured' },
          { key: 'isArchived', label: 'Archived' },
          { key: 'isActive', label: 'Active' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">{label}</label>
            <Toggle value={f[key]} onChange={(v) => s(key, v)} />
          </div>
        ))}
      </div>

      <div className={`rounded-xl border p-4 space-y-3 ${hasOwnBlock ? 'border-blue-100 bg-blue-50/60' : 'border-violet-100 bg-violet-50/60'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-semibold ${hasOwnBlock ? 'text-blue-800' : 'text-violet-800'}`}>
              🏠 Show on Home Page
            </p>
            <p className={`text-xs mt-0.5 ${hasOwnBlock ? 'text-blue-500' : 'text-violet-500'}`}>
              {hasOwnBlock
                ? `Appears in the "${SECTION_CONFIG[section]}" block on home (max ${maxHomeSlots}).`
                : 'Feature this article in one of the existing home sections (max 4 per section).'}
              {!f.showOnHome && canShowHome && ` ${remaining} slot${remaining !== 1 ? 's' : ''} remaining.`}
              {!canShowHome && !f.showOnHome && ' ⚠ No slots remaining. Remove one first.'}
            </p>
          </div>

          <Toggle
            value={f.showOnHome}
            onChange={(v) => {
              if (!canShowHome && v) return;
              s('showOnHome', v);
              if (!v) s('homeSection', '');
            }}
          />
        </div>

        {f.showOnHome && !hasOwnBlock && (
          <div className="grid gap-3 sm:grid-cols-2 border-t border-violet-100 pt-3">
            <div>
              <label className="label text-violet-700">Home Section *</label>
              <select
                value={f.homeSection}
                onChange={(e) => s('homeSection', e.target.value)}
                className="input w-full"
              >
                <option value="">— Select section —</option>
                {HOME_TARGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-violet-700">Position (1 = first, max 4)</label>
              <input
                type="number"
                min={1}
                max={4}
                value={f.homeSortOrder}
                onChange={(e) => s('homeSortOrder', Number(e.target.value))}
                className="input w-full"
              />
            </div>
          </div>
        )}

        {f.showOnHome && hasOwnBlock && (
          <div className="border-t border-blue-100 pt-3">
            <label className="label text-blue-700">Position (1 = first shown, max {maxHomeSlots})</label>
            <input
              type="number"
              min={1}
              max={maxHomeSlots}
              value={f.homeSortOrder}
              onChange={(e) => s('homeSortOrder', Number(e.target.value))}
              className="input w-40"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end pt-1">
        {onCancel && (
          <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        )}

        <button
          onClick={() => onSave({ ...f, hashtags: normalizeHashtagsInput(hashtagsText) }, file)}
          disabled={saving || !f.title || (section === 'video' && !f.videoId)}
          className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </div>
  );
}

function Row({ a, section, onEdit, onDelete }: any) {
  const isVideo = section === 'video';
  const ytThumb = isVideo && a.videoId ? `https://img.youtube.com/vi/${a.videoId}/mqdefault.jpg` : null;
  const imgSrc = a.imageUrl || ytThumb || '';

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
      {imgSrc && (
        <div className="relative h-14 w-20 flex-shrink-0">
          <img src={imgSrc} className="h-full w-full rounded-xl object-cover" alt="" />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600/80">
                <svg className="h-2.5 w-2.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">#{a.sortOrder}</span>
          {a.isFeatured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
          {a.isArchived && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">Archived</span>}
          {a.showOnHome && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              🏠 Home #{a.homeSortOrder}
            </span>
          )}
          {isVideo && a.videoId && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">▶ {a.videoId}</span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {a.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>

        <p className="font-semibold text-gray-800 truncate text-sm">{a.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{a.category} · {a.author} · {a.date}</p>

        {Array.isArray(a.hashtags) && a.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {a.hashtags.slice(0, 4).map((tag: string) => (
              <span
                key={tag}
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {a.hashtags.length > 4 && (
              <span className="text-[11px] text-gray-400">+{a.hashtags.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onEdit} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
          Edit
        </button>
        <button onClick={onDelete} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
          Delete
        </button>
      </div>
    </div>
  );
}

export function AdminMoreSections() {
  const { section = 'interviews' } = useParams<{ section: string }>();
  const label = SECTION_CONFIG[section] || section;
  const hasOwnBlock = OWN_HOME_SECTIONS.includes(section);
  const { get, post, put, del } = useAdminApi();

  const [articles, setArticles] = useState<any[]>([]);
  const { filtered: filteredArticles, filterBar } = useAdminArticleFilter(articles);
  const [homeCount, setHomeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await get(`/section-articles/admin/all?section=${section}`);
      setArticles(data);

      if (hasOwnBlock) {
        const res = await fetch(`${API_URL}/section-articles/home-count/${section}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('lp_admin_token')}` },
        });
        const countData = await res.json();
        setHomeCount(countData.count || 0);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    setAdding(false);
    setEditId(null);
    setSaveError('');
    load();
  }, [section]);

  const toFD = (f: any, file: File | null) => {
    const fd = new FormData();

    Object.entries(f).forEach(([k, v]) => {
      if (v === undefined || v === null) return;

      if (k === 'hashtags') {
        fd.append('hashtags', JSON.stringify(v));
      } else {
        fd.append(k, String(v));
      }
    });

    if (file) fd.append('image', file);
    return fd;
  };

  const onCreate = async (f: any, file: File | null) => {
    setSaving(true);
    setSaveError('');
    try {
      await post('/section-articles', toFD({ ...f, section }, file));
      setAdding(false);
      await load();
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save.');
    }
    setSaving(false);
  };

  const onUpdate = async (f: any, file: File | null) => {
    setSaving(true);
    setSaveError('');
    try {
      await put(`/section-articles/${f._id}`, toFD(f, file));
      setEditId(null);
      await load();
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save.');
    }
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    try {
      await del(`/section-articles/${id}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{label}</h2>
          <p className="text-sm text-gray-500">
            Manage articles for the {label} page.
            {hasOwnBlock && ` Up to ${section === 'diplomatic-corner' ? 8 : 4} can appear on the home page (${homeCount}/${section === 'diplomatic-corner' ? 8 : 4} used).`}
            {!hasOwnBlock && ' Toggle "Show on Home Page" to feature in an existing home section.'}
          </p>
        </div>

        {!adding && (
          <button
            onClick={() => { setAdding(true); setEditId(null); setSaveError(''); }}
            className="flex-shrink-0 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            + New Article
          </button>
        )}
      </div>

      {hasOwnBlock && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: section === 'diplomatic-corner' ? 8 : 4 }).map((_, n) => (
                <div
                  key={n}
                  className={`h-3 w-6 rounded-full ${n < homeCount ? 'bg-blue-500' : 'bg-blue-200'}`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-blue-700">
              {homeCount}/{section === 'diplomatic-corner' ? 8 : 4} slots used on home page
            </p>
          </div>
        </div>
      )}

      {adding && (
        <Form
          section={section}
          homeCount={homeCount}
          onSave={onCreate}
          onCancel={() => { setAdding(false); setSaveError(''); }}
          saving={saving}
          error={saveError}
        />
      )}

      {loading && <div className="py-16 text-center text-gray-400">Loading...</div>}

      {!loading && articles.length === 0 && !adding && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="text-base font-semibold text-gray-500">No articles yet for {label}</p>
          <p className="mt-1 text-sm text-gray-400">Click "New Article" to get started.</p>
        </div>
      )}

      {!loading && articles.length > 0 && filterBar}

      {!loading && (
        <div className="space-y-3">
          {filteredArticles.length === 0 && !adding ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center text-gray-400">
              <p className="text-sm font-medium">No articles match your filter.</p>
            </div>
          ) : (
            filteredArticles.map((a) =>
              editId === a._id ? (
                <Form
                  key={a._id}
                  init={a}
                  section={section}
                  homeCount={homeCount}
                  onSave={onUpdate}
                  onCancel={() => { setEditId(null); setSaveError(''); }}
                  saving={saving}
                  error={saveError}
                />
              ) : (
                <Row
                  key={a._id}
                  a={a}
                  section={section}
                  onEdit={() => { setEditId(a._id); setAdding(false); setSaveError(''); }}
                  onDelete={() => onDelete(a._id)}
                />
              )
            )
          )}
        </div>
      )}
    </div>
  );
}