


// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAdminApi } from '../../hooks/useAdminApi';
// import { useAdminArticleFilter } from '../../hooks/useAdminArticleFilter';
// import { RichTextEditor } from '../../components/RichTextEditor';

// const REGION_CONFIG: Record<string, { label: string; subCategories: string[] }> = {
//   asia:       { label: 'Asia',        subCategories: ['East Asia', 'South Asia', 'Southeast Asia', 'Central Asia'] },
//   europe:     { label: 'Europe',      subCategories: ['Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe'] },
//   middleeast: { label: 'Middle East', subCategories: [] },
//   oceania:    { label: 'Oceania',     subCategories: [] },
//   africa:     { label: 'Africa',      subCategories: ['North Africa', 'South Africa'] },
//   americas:   { label: 'Americas',    subCategories: ['North America', 'Latin America & Caribbean', 'South America'] },
//   caucasus:   { label: 'Caucasus',    subCategories: [] },
//   russia:     { label: 'Russia',      subCategories: [] },
// };

// const BASE_HOME_SECTIONS = [
//   { value: 'uk',            label: 'United Kingdom' },
//   { value: 'editors-picks', label: "Editor's Picks" },
//   { value: 'in-focus',      label: 'In Focus' },
// ];

// // Region-specific home sections — shown only when editing that region
// const REGION_SPECIFIC_HOME: Record<string, { value: string; label: string }[]> = {
//   asia:   [{ value: 'central-asia', label: '🏠 Central Asia (Homepage Carousel)' }],
//   europe: [{ value: 'europe-home',  label: '🏠 Europe (Homepage Feature)' }],
// };

// const slugify = (s: string) =>
//   s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// const EMPTY: any = {
//   title: '', subtitle: '', content: '', author: '', date: '', category: '',
//   subCategory: '', isFeatured: false, isArchived: false, isActive: true,
//   sortOrder: 0, showOnHome: false, homeSection: '', homeSortOrder: 1,
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

// function Form({ init, region, subCategories, onSave, onCancel, saving, error }: any) {
//   const [f, setF] = useState<any>({ ...EMPTY, region, ...(init || {}) });
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState(init?.imageUrl || '');
//   const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

//   const allHomeSections = [
//     ...BASE_HOME_SECTIONS,
//     ...(REGION_SPECIFIC_HOME[region] || []),
//   ];

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

//       {/* Basic fields */}
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
//           <label className="label">Category (e.g. Diplomacy, Analysis)</label>
//           <input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" />
//         </div>
//         <div>
//           <label className="label">Sort Order (lower = shown first)</label>
//           <input type="number" value={f.sortOrder} onChange={(e) => s('sortOrder', Number(e.target.value))} className="input w-full" />
//         </div>

//         {/* Sub-category dropdown — only if region has them */}
//         {subCategories.length > 0 && (
//           <div className="sm:col-span-2">
//             <label className="label">Sub-Category (which filter tab this shows under)</label>
//             <select value={f.subCategory} onChange={(e) => s('subCategory', e.target.value)} className="input w-full">
//               <option value="">— Show under all of {REGION_CONFIG[region]?.label} —</option>
//               {subCategories.map((sc: string) => (
//                 <option key={sc} value={slugify(sc)}>{sc}</option>
//               ))}
//             </select>
//             <p className="mt-1 text-xs text-gray-400">
//               Leave blank to show on the main region page. Select a sub-category to also appear when that filter is selected.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Rich text content */}
//       <div>
//         <label className="label">Full Article Content (bold, headings, lists — paste from anywhere)</label>
//         <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
//       </div>

//       {/* Cover image */}
//       <div>
//         <label className="label">Cover Image</label>
//         <div className="flex flex-wrap items-center gap-3">
//           {preview && (
//             <img src={preview} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-200" />
//           )}
//           <input
//             type="file" accept="image/*"
//             onChange={(e) => {
//               const fl = e.target.files?.[0];
//               if (fl) { setFile(fl); setPreview(URL.createObjectURL(fl)); }
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
//           { key: 'isActive',   label: 'Active' },
//         ].map(({ key, label }) => (
//           <div key={key} className="flex items-center gap-2">
//             <label className="text-xs font-medium text-gray-600">{label}</label>
//             <Toggle value={f[key]} onChange={(v) => s(key, v)} />
//           </div>
//         ))}
//       </div>

//       {/* Home page section */}
//       <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-semibold text-blue-800">🏠 Show on Home Page</p>
//             <p className="text-xs text-blue-500 mt-0.5">
//               Feature this article in one of the homepage sections (max 4 per section)
//             </p>
//           </div>
//           <Toggle value={f.showOnHome} onChange={(v) => { s('showOnHome', v); if (!v) s('homeSection', ''); }} />
//         </div>

//         {f.showOnHome && (
//           <div className="grid gap-3 sm:grid-cols-2 border-t border-blue-100 pt-4">
//             <div>
//               <label className="label text-blue-700">Home Section *</label>
//               <select value={f.homeSection} onChange={(e) => s('homeSection', e.target.value)} className="input w-full">
//                 <option value="">— Select section —</option>
//                 {allHomeSections.map((hs) => (
//                   <option key={hs.value} value={hs.value}>{hs.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="label text-blue-700">Position (1 = first, max 4)</label>
//               <input
//                 type="number" min={1} max={4}
//                 value={f.homeSortOrder}
//                 onChange={(e) => s('homeSortOrder', Number(e.target.value))}
//                 className="input w-full"
//               />
//             </div>
//             <p className="sm:col-span-2 text-xs text-blue-600">
//               To replace an article, edit that article and turn off "Show on Home Page" first, then set this one.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Save / Cancel */}
//       <div className="flex gap-3 justify-end pt-1">
//         {onCancel && (
//           <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
//             Cancel
//           </button>
//         )}
//         <button
//           onClick={() => onSave(f, file)}
//           disabled={saving || !f.title}
//           className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
//         >
//           {saving ? 'Saving...' : 'Save Article'}
//         </button>
//       </div>
//     </div>
//   );
// }

// function ArticleRow({ a, onEdit, onDelete, region }: any) {
//   const allHomeSections = [
//     ...BASE_HOME_SECTIONS,
//     ...(REGION_SPECIFIC_HOME[region] || []),
//   ];

//   const homeSectionLabel = allHomeSections.find((h) => h.value === a.homeSection)?.label;

//   return (
//     <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
//       {a.imageUrl && (
//         <img src={a.imageUrl} className="h-14 w-20 flex-shrink-0 rounded-xl object-cover" alt="" />
//       )}
//       <div className="flex-1 min-w-0">
//         <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
//           <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
//             #{a.sortOrder}
//           </span>
//           {a.isFeatured && (
//             <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>
//           )}
//           {a.isArchived && (
//             <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">Archived</span>
//           )}
//           {a.showOnHome && homeSectionLabel && (
//             <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
//               🏠 {homeSectionLabel} #{a.homeSortOrder}
//             </span>
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

// export function AdminWorldRegions() {
//   const { region = 'asia' } = useParams<{ region: string }>();
//   const config = REGION_CONFIG[region] || { label: region, subCategories: [] };
//   const { get, post, put, del } = useAdminApi();

//   const [articles, setArticles] = useState<any[]>([]);
//  const { filtered: filteredArticles, filterBar } = useAdminArticleFilter(articles);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState('');
//   const [activeSub, setActiveSub] = useState('all');

//   const load = async () => {
//     setLoading(true);
//     try {
//       let url = `/region-articles/admin/all?region=${region}`;
//       if (activeSub !== 'all') url += `&subCategory=${activeSub}`;
//       const data = await get(url);
//       setArticles(data);
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   // Reset state when region changes
//   useEffect(() => {
//     setAdding(false);
//     setEditId(null);
//     setSaveError('');
//     setActiveSub('all');
//   }, [region]);

//   useEffect(() => { load(); }, [region, activeSub]);

//   const toFD = (f: any, file: File | null) => {
//     const fd = new FormData();
//     Object.entries(f).forEach(([k, v]) => {
//       if (v !== undefined && v !== null) fd.append(k, String(v));
//     });
//     if (file) fd.append('image', file);
//     return fd;
//   };

//   const onCreate = async (f: any, file: File | null) => {
//     setSaving(true); setSaveError('');
//     try {
//       await post('/region-articles', toFD({ ...f, region }, file));
//       setAdding(false);
//       await load();
//     } catch (e: any) { setSaveError(e.message || 'Failed to save. Please try again.'); }
//     setSaving(false);
//   };

//   const onUpdate = async (f: any, file: File | null) => {
//     setSaving(true); setSaveError('');
//     try {
//       await put(`/region-articles/${f._id}`, toFD(f, file));
//       setEditId(null);
//       await load();
//     } catch (e: any) { setSaveError(e.message || 'Failed to save. Please try again.'); }
//     setSaving(false);
//   };

//   const onDelete = async (id: string) => {
//     if (!confirm('Delete this article permanently?')) return;
//     try {
//       await del(`/region-articles/${id}`);
//       await load();
//     } catch (e) { console.error(e); }
//   };

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">{config.label}</h2>
//           <p className="text-sm text-gray-500">
//             Manage articles for the {config.label} page. Toggle "Show on Home Page" to feature in homepage sections.
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

//       {/* Sub-category filter */}
//       {config.subCategories.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => setActiveSub('all')}
//             className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
//               activeSub === 'all' ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             All
//           </button>
//           {config.subCategories.map((sc) => (
//             <button
//               key={sc}
//               onClick={() => setActiveSub(slugify(sc))}
//               className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
//                 activeSub === slugify(sc) ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               {sc}
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Add form */}
//       {adding && (
//         <Form
//           region={region}
//           subCategories={config.subCategories}
//           onSave={onCreate}
//           onCancel={() => { setAdding(false); setSaveError(''); }}
//           saving={saving}
//           error={saveError}
//         />
//       )}

//       {/* Loading */}
//       {loading && (
//         <div className="py-16 text-center text-gray-400">Loading articles...</div>
//       )}

//       {/* Empty state */}
//       {!loading && articles.length === 0 && !adding && (
//         <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
//           <p className="text-base font-semibold text-gray-500">No articles yet for {config.label}</p>
//           <p className="mt-1 text-sm text-gray-400">Click "New Article" to add the first one.</p>
//         </div>
//       )}

//       {/* Add this right before the articles list, after the slot indicator */}
//       {!loading && articles.length > 0 && filterBar}

//       {/* Article list */}
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
//                   region={region}
//                   subCategories={config.subCategories}
//                   onSave={onUpdate}
//                   onCancel={() => { setEditId(null); setSaveError(''); }}
//                   saving={saving}
//                   error={saveError}
//                 />
//               ) : (
//                 <ArticleRow
//                   key={a._id}
//                   a={a}
//                   region={region}
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


// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAdminApi } from '../../hooks/useAdminApi';
// import { useAdminArticleFilter } from '../../hooks/useAdminArticleFilter';
// import { RichTextEditor } from '../../components/RichTextEditor';

// const REGION_CONFIG: Record<string, { label: string; subCategories: string[] }> = {
//   asia:       { label: 'Asia',        subCategories: ['East Asia', 'South Asia', 'Southeast Asia', 'Central Asia'] },
//   europe:     { label: 'Europe',      subCategories: ['Western Europe', 'Eastern Europe', 'Northern Europe', 'Southern Europe'] },
//   middleeast: { label: 'Middle East', subCategories: [] },
//   oceania:    { label: 'Oceania',     subCategories: [] },
//   africa:     { label: 'Africa',      subCategories: ['North Africa', 'South Africa'] },
//   americas:   { label: 'Americas',    subCategories: ['North America', 'Latin America & Caribbean', 'South America'] },
//   caucasus:   { label: 'Caucasus',    subCategories: [] },
//   russia:     { label: 'Russia',      subCategories: [] },
// };

// const BASE_HOME_SECTIONS = [
//   { value: 'uk',            label: 'United Kingdom' },
//   { value: 'editors-picks', label: "Editor's Picks" },
//   { value: 'in-focus',      label: 'In Focus' },
// ];

// const REGION_SPECIFIC_HOME: Record<string, { value: string; label: string }[]> = {
//   asia:   [{ value: 'central-asia', label: '🏠 Central Asia (Homepage Carousel)' }],
//   europe: [{ value: 'europe-home',  label: '🏠 Europe (Homepage Feature)' }],
// };

// const slugify = (s: string) =>
//   s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// const EMPTY: any = {
//   title: '',
//   subtitle: '',
//   content: '',
//   author: '',
//   date: '',
//   category: '',
//   hashtags: [],
//   subCategory: '',
//   isFeatured: false,
//   isArchived: false,
//   isActive: true,
//   sortOrder: 0,
//   showOnHome: false,
//   homeSection: '',
//   homeSortOrder: 1,
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

// function normalizeHashtagsInput(text: string) {
//   return [...new Set(
//     text
//       .split(',')
//       .map((tag) => tag.trim())
//       .filter(Boolean)
//       .map((tag) => tag.replace(/^#+/, ''))
//       .map((tag) => tag.replace(/\s+/g, '-'))
//       .map((tag) => tag.replace(/[^a-zA-Z0-9-_]/g, ''))
//       .filter(Boolean)
//       .slice(0, 20)
//   )];
// }

// function Form({ init, region, subCategories, onSave, onCancel, saving, error }: any) {
//   const [f, setF] = useState<any>({ ...EMPTY, region, ...(init || {}) });
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState(init?.imageUrl || '');
//   const [hashtagsText, setHashtagsText] = useState(
//     Array.isArray(init?.hashtags) ? init.hashtags.join(', ') : ''
//   );

//   const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

//   const allHomeSections = [
//     ...BASE_HOME_SECTIONS,
//     ...(REGION_SPECIFIC_HOME[region] || []),
//   ];

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
//           <label className="label">Category (e.g. Diplomacy, Analysis)</label>
//           <input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" />
//         </div>

//         <div>
//           <label className="label">Sort Order (lower = shown first)</label>
//           <input
//             type="number"
//             value={f.sortOrder}
//             onChange={(e) => s('sortOrder', Number(e.target.value))}
//             className="input w-full"
//           />
//         </div>

//         <div className="sm:col-span-2">
//           <label className="label">Hashtags</label>
//           <input
//             value={hashtagsText}
//             onChange={(e) => setHashtagsText(e.target.value)}
//             placeholder="Example: geopolitics, asia, diplomacy"
//             className="input w-full"
//           />
//           <p className="mt-1 text-xs text-gray-400">
//             Separate hashtags with commas. # is optional.
//           </p>

//           {normalizeHashtagsInput(hashtagsText).length > 0 && (
//             <div className="mt-3 flex flex-wrap gap-2">
//               {normalizeHashtagsInput(hashtagsText).map((tag) => (
//                 <span
//                   key={tag}
//                   className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
//                 >
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         {subCategories.length > 0 && (
//           <div className="sm:col-span-2">
//             <label className="label">Sub-Category (which filter tab this shows under)</label>
//             <select value={f.subCategory} onChange={(e) => s('subCategory', e.target.value)} className="input w-full">
//               <option value="">— Show under all of {REGION_CONFIG[region]?.label} —</option>
//               {subCategories.map((sc: string) => (
//                 <option key={sc} value={slugify(sc)}>{sc}</option>
//               ))}
//             </select>
//             <p className="mt-1 text-xs text-gray-400">
//               Leave blank to show on the main region page. Select a sub-category to also appear when that filter is selected.
//             </p>
//           </div>
//         )}
//       </div>

//       <div>
//         <label className="label">Full Article Content (bold, headings, lists — paste from anywhere)</label>
//         <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
//       </div>

//       <div>
//         <label className="label">Cover Image</label>
//         <div className="flex flex-wrap items-center gap-3">
//           {preview && (
//             <img src={preview} alt="" className="h-16 w-24 rounded-xl object-cover border border-gray-200" />
//           )}
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

//       <div className="flex flex-wrap gap-6">
//         {[
//           { key: 'isFeatured', label: 'Featured' },
//           { key: 'isArchived', label: 'Archived' },
//           { key: 'isActive',   label: 'Active' },
//         ].map(({ key, label }) => (
//           <div key={key} className="flex items-center gap-2">
//             <label className="text-xs font-medium text-gray-600">{label}</label>
//             <Toggle value={f[key]} onChange={(v) => s(key, v)} />
//           </div>
//         ))}
//       </div>

//       <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm font-semibold text-blue-800">🏠 Show on Home Page</p>
//             <p className="text-xs text-blue-500 mt-0.5">
//               Feature this article in one of the homepage sections (max 4 per section)
//             </p>
//           </div>
//           <Toggle value={f.showOnHome} onChange={(v) => { s('showOnHome', v); if (!v) s('homeSection', ''); }} />
//         </div>

//         {f.showOnHome && (
//           <div className="grid gap-3 sm:grid-cols-2 border-t border-blue-100 pt-4">
//             <div>
//               <label className="label text-blue-700">Home Section *</label>
//               <select value={f.homeSection} onChange={(e) => s('homeSection', e.target.value)} className="input w-full">
//                 <option value="">— Select section —</option>
//                 {allHomeSections.map((hs) => (
//                   <option key={hs.value} value={hs.value}>{hs.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="label text-blue-700">Position (1 = first, max 4)</label>
//               <input
//                 type="number"
//                 min={1}
//                 max={4}
//                 value={f.homeSortOrder}
//                 onChange={(e) => s('homeSortOrder', Number(e.target.value))}
//                 className="input w-full"
//               />
//             </div>

//             <p className="sm:col-span-2 text-xs text-blue-600">
//               To replace an article, edit that article and turn off "Show on Home Page" first, then set this one.
//             </p>
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
//           onClick={() => onSave({ ...f, hashtags: normalizeHashtagsInput(hashtagsText) }, file)}
//           disabled={saving || !f.title}
//           className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
//         >
//           {saving ? 'Saving...' : 'Save Article'}
//         </button>
//       </div>
//     </div>
//   );
// }

// function ArticleRow({ a, onEdit, onDelete, region }: any) {
//   const allHomeSections = [
//     ...BASE_HOME_SECTIONS,
//     ...(REGION_SPECIFIC_HOME[region] || []),
//   ];

//   const homeSectionLabel = allHomeSections.find((h) => h.value === a.homeSection)?.label;

//   return (
//     <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
//       {a.imageUrl && (
//         <img src={a.imageUrl} className="h-14 w-20 flex-shrink-0 rounded-xl object-cover" alt="" />
//       )}

//       <div className="flex-1 min-w-0">
//         <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
//           <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
//             #{a.sortOrder}
//           </span>

//           {a.isFeatured && (
//             <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>
//           )}

//           {a.isArchived && (
//             <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">Archived</span>
//           )}

//           {a.showOnHome && homeSectionLabel && (
//             <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
//               🏠 {homeSectionLabel} #{a.homeSortOrder}
//             </span>
//           )}

//           <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
//             {a.isActive ? 'Active' : 'Hidden'}
//           </span>
//         </div>

//         <p className="font-semibold text-gray-800 truncate text-sm">{a.title}</p>
//         <p className="text-xs text-gray-400 mt-0.5">{a.category} · {a.author} · {a.date}</p>

//         {Array.isArray(a.hashtags) && a.hashtags.length > 0 && (
//           <div className="mt-2 flex flex-wrap gap-1.5">
//             {a.hashtags.slice(0, 4).map((tag: string) => (
//               <span
//                 key={tag}
//                 className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-600"
//               >
//                 #{tag}
//               </span>
//             ))}
//             {a.hashtags.length > 4 && (
//               <span className="text-[11px] text-gray-400">+{a.hashtags.length - 4} more</span>
//             )}
//           </div>
//         )}
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

// export function AdminWorldRegions() {
//   const { region = 'asia' } = useParams<{ region: string }>();
//   const config = REGION_CONFIG[region] || { label: region, subCategories: [] };
//   const { get, post, put, del } = useAdminApi();

//   const [articles, setArticles] = useState<any[]>([]);
//   const { filtered: filteredArticles, filterBar } = useAdminArticleFilter(articles);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState('');
//   const [activeSub, setActiveSub] = useState('all');

//   const load = async () => {
//     setLoading(true);
//     try {
//       let url = `/region-articles/admin/all?region=${region}`;
//       if (activeSub !== 'all') url += `&subCategory=${activeSub}`;
//       const data = await get(url);
//       setArticles(data);
//     } catch (e) {
//       console.error(e);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     setAdding(false);
//     setEditId(null);
//     setSaveError('');
//     setActiveSub('all');
//   }, [region]);

//   useEffect(() => {
//     load();
//   }, [region, activeSub]);

//   const toFD = (f: any, file: File | null) => {
//     const fd = new FormData();

//     Object.entries(f).forEach(([k, v]) => {
//       if (v === undefined || v === null) return;

//       if (k === 'hashtags') {
//         fd.append('hashtags', JSON.stringify(v));
//       } else {
//         fd.append(k, String(v));
//       }
//     });

//     if (file) fd.append('image', file);
//     return fd;
//   };

//   const onCreate = async (f: any, file: File | null) => {
//     setSaving(true);
//     setSaveError('');
//     try {
//       await post('/region-articles', toFD({ ...f, region }, file));
//       setAdding(false);
//       await load();
//     } catch (e: any) {
//       setSaveError(e.message || 'Failed to save. Please try again.');
//     }
//     setSaving(false);
//   };

//   const onUpdate = async (f: any, file: File | null) => {
//     setSaving(true);
//     setSaveError('');
//     try {
//       await put(`/region-articles/${f._id}`, toFD(f, file));
//       setEditId(null);
//       await load();
//     } catch (e: any) {
//       setSaveError(e.message || 'Failed to save. Please try again.');
//     }
//     setSaving(false);
//   };

//   const onDelete = async (id: string) => {
//     if (!confirm('Delete this article permanently?')) return;
//     try {
//       await del(`/region-articles/${id}`);
//       await load();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">{config.label}</h2>
//           <p className="text-sm text-gray-500">
//             Manage articles for the {config.label} page. Toggle "Show on Home Page" to feature in homepage sections.
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

//       {config.subCategories.length > 0 && (
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => setActiveSub('all')}
//             className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
//               activeSub === 'all' ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             All
//           </button>

//           {config.subCategories.map((sc) => (
//             <button
//               key={sc}
//               onClick={() => setActiveSub(slugify(sc))}
//               className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
//                 activeSub === slugify(sc) ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               {sc}
//             </button>
//           ))}
//         </div>
//       )}

//       {adding && (
//         <Form
//           region={region}
//           subCategories={config.subCategories}
//           onSave={onCreate}
//           onCancel={() => { setAdding(false); setSaveError(''); }}
//           saving={saving}
//           error={saveError}
//         />
//       )}

//       {loading && (
//         <div className="py-16 text-center text-gray-400">Loading articles...</div>
//       )}

//       {!loading && articles.length === 0 && !adding && (
//         <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
//           <p className="text-base font-semibold text-gray-500">No articles yet for {config.label}</p>
//           <p className="mt-1 text-sm text-gray-400">Click "New Article" to add the first one.</p>
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
//                   region={region}
//                   subCategories={config.subCategories}
//                   onSave={onUpdate}
//                   onCancel={() => { setEditId(null); setSaveError(''); }}
//                   saving={saving}
//                   error={saveError}
//                 />
//               ) : (
//                 <ArticleRow
//                   key={a._id}
//                   a={a}
//                   region={region}
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

const REGION_CONFIG: Record<string, { label: string; subCategories: string[] }> = {
  asia:       { label: 'Asia',        subCategories: ['East Asia', 'South Asia', 'Southeast Asia', 'Central Asia'] },
  europe:     { label: 'Europe',      subCategories: [] },
  middleeast: { label: 'Middle East', subCategories: [] },
  oceania:    { label: 'Oceania',     subCategories: [] },
  africa:     { label: 'Africa',      subCategories: [] },
  americas:   { label: 'Americas',    subCategories: ['North America', 'Latin America & Caribbean', 'South America'] },
  caucasus:   { label: 'Caucasus',    subCategories: [] },
  russia:     { label: 'Russia',      subCategories: [] },
};

const BASE_HOME_SECTIONS = [
  { value: 'uk',            label: 'United Kingdom' },
  { value: 'editors-picks', label: "Editor's Picks" },
  { value: 'in-focus',      label: 'In Focus' },
];

const REGION_SPECIFIC_HOME: Record<string, { value: string; label: string }[]> = {
  asia:   [{ value: 'central-asia', label: '🏠 Central Asia (Homepage Carousel)' }],
  europe: [{ value: 'europe-home',  label: '🏠 Europe (Homepage Feature)' }],
  russia: [{ value: 'russia-home',  label: '🏠 Russia (Homepage Feature)' }],
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getHomeSectionMax = (homeSection: string) => {
  if (homeSection === 'central-asia') return 8;
  if (homeSection === 'russia-home') return 5;
  return 4;
};

const EMPTY: any = {
  title: '',
  subtitle: '',
  content: '',
  author: '',
  date: '',
  category: '',
  hashtags: [],
  subCategory: '',
  isFeatured: false,
  isArchived: false,
  isActive: true,
  sortOrder: 0,
  showOnHome: false,
  homeSection: '',
  homeSortOrder: 1,
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

function Form({ init, region, subCategories, onSave, onCancel, saving, error }: any) {
  const [f, setF] = useState<any>({ ...EMPTY, region, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(init?.imageUrl || '');
  const [hashtagsText, setHashtagsText] = useState(
    Array.isArray(init?.hashtags) ? init.hashtags.join(', ') : ''
  );

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const allHomeSections = [
    ...BASE_HOME_SECTIONS,
    ...(REGION_SPECIFIC_HOME[region] || []),
  ];

  const selectedHomeMax = getHomeSectionMax(f.homeSection);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
      <h3 className="border-b border-gray-100 pb-3 text-base font-semibold text-gray-800">
        {init?._id ? 'Edit Article' : 'New Article'}
      </h3>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
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
          <label className="label">Category (e.g. Diplomacy, Analysis)</label>
          <input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" />
        </div>

        <div>
          <label className="label">Sort Order (lower = shown first)</label>
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
            placeholder="Example: geopolitics, asia, diplomacy"
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

        {subCategories.length > 0 && (
          <div className="sm:col-span-2">
            <label className="label">Sub-Category (which filter tab this shows under)</label>
            <select value={f.subCategory} onChange={(e) => s('subCategory', e.target.value)} className="input w-full">
              <option value="">— Show under all of {REGION_CONFIG[region]?.label} —</option>
              {subCategories.map((sc: string) => (
                <option key={sc} value={slugify(sc)}>{sc}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Leave blank to show on the main region page. Select a sub-category to also appear when that filter is selected.
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="label">Full Article Content (bold, headings, lists — paste from anywhere)</label>
        <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
      </div>

      <div>
        <label className="label">Cover Image</label>
        <div className="flex flex-wrap items-center gap-3">
          {preview && (
            <img src={preview} alt="" className="h-16 w-24 rounded-xl border border-gray-200 object-cover" />
          )}
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

      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-800">🏠 Show on Home Page</p>
            <p className="mt-0.5 text-xs text-blue-500">
              Feature this article in one of the homepage sections.
            </p>
          </div>
          <Toggle
            value={f.showOnHome}
            onChange={(v) => {
              s('showOnHome', v);
              if (!v) s('homeSection', '');
            }}
          />
        </div>

        {f.showOnHome && (
          <div className="grid gap-3 border-t border-blue-100 pt-4 sm:grid-cols-2">
            <div>
              <label className="label text-blue-700">Home Section *</label>
              <select value={f.homeSection} onChange={(e) => s('homeSection', e.target.value)} className="input w-full">
                <option value="">— Select section —</option>
                {allHomeSections.map((hs) => (
                  <option key={hs.value} value={hs.value}>{hs.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-blue-700">
                Position (1 = first, max {selectedHomeMax || 4})
              </label>
              <input
                type="number"
                min={1}
                max={selectedHomeMax || 4}
                value={f.homeSortOrder}
                onChange={(e) => s('homeSortOrder', Number(e.target.value))}
                className="input w-full"
              />
            </div>

            <p className="sm:col-span-2 text-xs text-blue-600">
              Russia Home allows 5, Central Asia allows 8, other home sections allow 4.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-1">
        {onCancel && (
          <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        )}

        <button
          onClick={() => onSave({ ...f, hashtags: normalizeHashtagsInput(hashtagsText) }, file)}
          disabled={saving || !f.title}
          className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </div>
  );
}

function ArticleRow({ a, onEdit, onDelete, region }: any) {
  const allHomeSections = [
    ...BASE_HOME_SECTIONS,
    ...(REGION_SPECIFIC_HOME[region] || []),
  ];

  const homeSectionLabel = allHomeSections.find((h) => h.value === a.homeSection)?.label;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
      {a.imageUrl && (
        <img src={a.imageUrl} className="h-14 w-20 flex-shrink-0 rounded-xl object-cover" alt="" />
      )}

      <div className="flex-1 min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
            #{a.sortOrder}
          </span>

          {a.isFeatured && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>
          )}

          {a.isArchived && (
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">Archived</span>
          )}

          {a.showOnHome && homeSectionLabel && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
              🏠 {homeSectionLabel} #{a.homeSortOrder}
            </span>
          )}

          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {a.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>

        <p className="truncate text-sm font-semibold text-gray-800">{a.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{a.category} · {a.author} · {a.date}</p>

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

      <div className="flex flex-shrink-0 gap-2">
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

export function AdminWorldRegions() {
  const { region = 'asia' } = useParams<{ region: string }>();
  const config = REGION_CONFIG[region] || { label: region, subCategories: [] };
  const { get, post, put, del } = useAdminApi();

  const [articles, setArticles] = useState<any[]>([]);
  const { filtered: filteredArticles, filterBar } = useAdminArticleFilter(articles);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeSub, setActiveSub] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      let url = `/region-articles/admin/all?region=${region}`;
      if (activeSub !== 'all') url += `&subCategory=${activeSub}`;
      const data = await get(url);
      setArticles(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    setAdding(false);
    setEditId(null);
    setSaveError('');
    setActiveSub('all');
  }, [region]);

  useEffect(() => {
    load();
  }, [region, activeSub]);

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
      await post('/region-articles', toFD({ ...f, region }, file));
      setAdding(false);
      await load();
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save. Please try again.');
    }
    setSaving(false);
  };

  const onUpdate = async (f: any, file: File | null) => {
    setSaving(true);
    setSaveError('');
    try {
      await put(`/region-articles/${f._id}`, toFD(f, file));
      setEditId(null);
      await load();
    } catch (e: any) {
      setSaveError(e.message || 'Failed to save. Please try again.');
    }
    setSaving(false);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return;
    try {
      await del(`/region-articles/${id}`);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{config.label}</h2>
          <p className="text-sm text-gray-500">
            Manage articles for the {config.label} page. Toggle "Show on Home Page" to feature in homepage sections.
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

      {config.subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSub('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeSub === 'all' ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>

          {config.subCategories.map((sc) => (
            <button
              key={sc}
              onClick={() => setActiveSub(slugify(sc))}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeSub === slugify(sc) ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>
      )}

      {adding && (
        <Form
          region={region}
          subCategories={config.subCategories}
          onSave={onCreate}
          onCancel={() => { setAdding(false); setSaveError(''); }}
          saving={saving}
          error={saveError}
        />
      )}

      {loading && (
        <div className="py-16 text-center text-gray-400">Loading articles...</div>
      )}

      {!loading && articles.length === 0 && !adding && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <p className="text-base font-semibold text-gray-500">No articles yet for {config.label}</p>
          <p className="mt-1 text-sm text-gray-400">Click "New Article" to add the first one.</p>
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
                  region={region}
                  subCategories={config.subCategories}
                  onSave={onUpdate}
                  onCancel={() => { setEditId(null); setSaveError(''); }}
                  saving={saving}
                  error={saveError}
                />
              ) : (
                <ArticleRow
                  key={a._id}
                  a={a}
                  region={region}
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