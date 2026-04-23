// import { useState, useEffect } from 'react';
// import { useAdminApi } from '../../hooks/useAdminApi';

// const EMPTY = { title: '', subtitle: '', author: '', date: '', category: '', region: '', topic: 'Trending News', sortOrder: 0, isActive: true };

// function Form({ init, onSave, onCancel, saving }: any) {
//   const [f, setF] = useState({ ...EMPTY, ...(init || {}) });
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState(init?.imageUrl || '');
//   const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
//   return (
//     <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
//       <div className="grid gap-3 sm:grid-cols-2">
//         <div className="sm:col-span-2"><label className="label">Title *</label><input value={f.title} onChange={(e) => s('title', e.target.value)} className="input w-full" /></div>
//         <div className="sm:col-span-2"><label className="label">Subtitle</label><input value={f.subtitle} onChange={(e) => s('subtitle', e.target.value)} className="input w-full" /></div>
//         <div><label className="label">Author</label><input value={f.author} onChange={(e) => s('author', e.target.value)} className="input w-full" /></div>
//         <div><label className="label">Date</label><input value={f.date} onChange={(e) => s('date', e.target.value)} className="input w-full" /></div>
//         <div><label className="label">Category</label><input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" /></div>
//         <div><label className="label">Sort Order (1 = first)</label><input type="number" value={f.sortOrder} onChange={(e) => s('sortOrder', Number(e.target.value))} className="input w-full" /></div>
//         <div className="sm:col-span-2">
//           <label className="label">Image</label>
//           <div className="flex flex-wrap items-center gap-3">
//             {preview && <img src={preview} className="h-14 w-20 rounded-lg object-cover border" />}
//             <input type="file" accept="image/*" onChange={(e) => { const fl = e.target.files?.[0]; if (fl) { setFile(fl); setPreview(URL.createObjectURL(fl)); }}}
//               className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-red-700" />
//           </div>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <label className="text-xs font-medium text-gray-600">Active</label>
//         <button onClick={() => s('isActive', !f.isActive)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${f.isActive ? 'bg-red-600' : 'bg-gray-300'}`}>
//           <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${f.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
//         </button>
//       </div>
//       <div className="flex gap-3 justify-end">
//         {onCancel && <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>}
//         <button onClick={() => onSave(f, file)} disabled={saving || !f.title} className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
//           {saving ? 'Saving...' : 'Save'}
//         </button>
//       </div>
//     </div>
//   );
// }

// export function AdminTrending() {
//   const { get, post, put, del } = useAdminApi();
//   const [articles, setArticles] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [adding, setAdding] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);

//   const load = () => get('/home-articles/section/trending').then(setArticles).finally(() => setLoading(false));
//   useEffect(() => { load(); }, []);

//   const toFD = (f: any, file: File | null) => {
//     const fd = new FormData();
//     fd.append('section', 'trending');
//     Object.entries(f).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)); });
//     if (file) fd.append('image', file);
//     return fd;
//   };

//   const onCreate = async (f: any, file: File | null) => { setSaving(true); try { await post('/home-articles', toFD(f, file)); setAdding(false); await load(); } catch (e) { console.error(e); } finally { setSaving(false); } };
//   const onUpdate = async (f: any, file: File | null) => { setSaving(true); try { await put(`/home-articles/${f._id}`, toFD(f, file)); setEditId(null); await load(); } catch (e) { console.error(e); } finally { setSaving(false); } };
//   const onDelete = async (id: string) => { if (!confirm('Delete?')) return; await del(`/home-articles/${id}`); await load(); };

//   if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Trending News</h2>
//           <p className="text-sm text-gray-500">4 articles shown in the trending grid. Sort Order controls column position (1–4).</p>
//         </div>
//         {!adding && <button onClick={() => setAdding(true)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">+ Add Article</button>}
//       </div>
//       {adding && <Form onSave={onCreate} onCancel={() => setAdding(false)} saving={saving} />}
//       {articles.length === 0 && !adding ? (
//         <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">No articles yet.</div>
//       ) : (
//         <div className="space-y-3">
//           {articles.map((a) =>
//             editId === a._id ? (
//               <Form key={a._id} init={a} onSave={onUpdate} onCancel={() => setEditId(null)} saving={saving} />
//             ) : (
//               <div key={a._id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
//                 {a.imageUrl && <img src={a.imageUrl} className="h-14 w-20 flex-shrink-0 rounded-xl object-cover" />}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">#{a.sortOrder}</span>
//                     <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{a.isActive ? 'Active' : 'Hidden'}</span>
//                   </div>
//                   <p className="font-semibold text-gray-800 truncate text-sm">{a.title}</p>
//                   <p className="text-xs text-gray-400">{a.category} · {a.author} · {a.date}</p>
//                 </div>
//                 <div className="flex gap-2 flex-shrink-0">
//                   <button onClick={() => setEditId(a._id)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
//                   <button onClick={() => onDelete(a._id)} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { RichTextEditor } from '../../components/RichTextEditor';

const EMPTY = {
  title: '', subtitle: '', content: '', author: '', date: '',
  category: '', region: '', topic: 'Trending News', sortOrder: 0, isActive: true,
};

function Form({ init, onSave, onCancel, saving }: any) {
  const [f, setF] = useState({ ...EMPTY, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(init?.imageUrl || '');
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
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
          <label className="label">Date</label>
          <input value={f.date} onChange={(e) => s('date', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Category</label>
          <input value={f.category} onChange={(e) => s('category', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Sort Order (1 = first column)</label>
          <input type="number" value={f.sortOrder} onChange={(e) => s('sortOrder', Number(e.target.value))} className="input w-full" />
        </div>
      </div>

      <div>
        <label className="label">Full Article Content (supports bold, headings, lists — paste from anywhere)</label>
        <RichTextEditor value={f.content} onChange={(html) => s('content', html)} />
      </div>

      <div>
        <label className="label">Cover Image</label>
        <div className="flex flex-wrap items-center gap-3">
          {preview && <img src={preview} alt="preview" className="h-14 w-20 rounded-lg object-cover border" />}
          <input
            type="file" accept="image/*"
            onChange={(e) => { const fl = e.target.files?.[0]; if (fl) { setFile(fl); setPreview(URL.createObjectURL(fl)); }}}
            className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-red-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-gray-600">Active</label>
        <button
          onClick={() => s('isActive', !f.isActive)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${f.isActive ? 'bg-red-600' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${f.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>

      <div className="flex gap-3 justify-end pt-1">
        {onCancel && (
          <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
        )}
        <button
          onClick={() => onSave(f, file)}
          disabled={saving || !f.title}
          className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export function AdminTrending() {
  const { get, post, put, del } = useAdminApi();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);

  const load = () =>
    get('/home-articles/admin/all?section=trending')
      .then(setArticles)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const toFD = (f: any, file: File | null) => {
    const fd = new FormData();
    fd.append('section', 'trending');
    Object.entries(f).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)); });
    if (file) fd.append('image', file);
    return fd;
  };

  const onCreate = async (f: any, file: File | null) => {
    setSaving(true);
    try { await post('/home-articles', toFD(f, file)); setAdding(false); await load(); }
    catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const onUpdate = async (f: any, file: File | null) => {
    setSaving(true);
    try { await put(`/home-articles/${f._id}`, toFD(f, file)); setEditId(null); await load(); }
    catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await del(`/home-articles/${id}`); await load();
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Trending News</h2>
          <p className="text-sm text-gray-500">4 articles in trending grid. Sort Order 1–4 = column position left to right.</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            + Add Article
          </button>
        )}
      </div>

      {adding && <Form onSave={onCreate} onCancel={() => setAdding(false)} saving={saving} />}

      {articles.length === 0 && !adding ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
          No articles yet.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) =>
            editId === a._id ? (
              <Form key={a._id} init={a} onSave={onUpdate} onCancel={() => setEditId(null)} saving={saving} />
            ) : (
              <div key={a._id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                {a.imageUrl && <img src={a.imageUrl} className="h-14 w-20 flex-shrink-0 rounded-xl object-cover" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">#{a.sortOrder}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      {a.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-800 truncate text-sm">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.category} · {a.author} · {a.date}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setEditId(a._id)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
                  <button onClick={() => onDelete(a._id)} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}