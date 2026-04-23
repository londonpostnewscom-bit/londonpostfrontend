
// import { useState, useEffect } from 'react';
// import { useAdminApi } from '../../hooks/useAdminApi';

// export function AdminHero() {
//   const { get, put } = useAdminApi();
//   const [hero,      setHero]      = useState<any>(null);
//   const [loading,   setLoading]   = useState(true);
//   const [saving,    setSaving]    = useState(false);
//   const [msg,       setMsg]       = useState({ text: '', type: '' });
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [preview,   setPreview]   = useState('');

//   useEffect(() => {
//     get('/hero').then(setHero).catch(console.error).finally(() => setLoading(false));
//   }, []);

//   const set = (k: string, v: any) => setHero((h: any) => ({ ...h, [k]: v }));

//   const handleSave = async () => {
//     if (!hero) return;
//     setSaving(true);
//     setMsg({ text: '', type: '' });
//     try {
//       const fd = new FormData();
//       const fields = ['mediaType', 'youtubeId', 'title', 'subtitle', 'ctaText', 'ctaLink', 'ctaText2', 'ctaLink2', 'badgeText', 'previewCaption', 'isActive'];
//       fields.forEach((k) => { if (hero[k] !== undefined) fd.append(k, String(hero[k])); });
//       if (imageFile) fd.append('media', imageFile);
//       const updated = await put('/hero', fd);
//       setHero(updated);
//       setMsg({ text: 'Hero saved successfully.', type: 'success' });
//       setImageFile(null);
//       setPreview('');
//     } catch (err: any) {
//       setMsg({ text: err.message, type: 'error' });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;
//   if (!hero)   return <div className="py-20 text-center text-red-500">Failed to load.</div>;

//   return (
//     <div className="max-w-2xl space-y-5">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
//         <p className="text-sm text-gray-500">Controls the top full-width banner. Upload a cover image, then set where the buttons link.</p>
//       </div>

//       {msg.text && (
//         <div className={`rounded-xl px-4 py-3 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
//           {msg.text}
//         </div>
//       )}

//       {/* Text Content */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
//         <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Text Content</h3>
//         <div>
//           <label className="label">Main Headline</label>
//           <textarea rows={2} value={hero.title || ''} onChange={(e) => set('title', e.target.value)} className="input w-full" />
//         </div>
//         <div>
//           <label className="label">Subtitle</label>
//           <textarea rows={2} value={hero.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="input w-full" />
//         </div>
//       </div>

//       {/* CTA Buttons */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
//         <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">
//           CTA Buttons — Paste article URL in the link field (e.g. /article/abc123)
//         </h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="label">Button 1 Text</label>
//             <input value={hero.ctaText || ''} onChange={(e) => set('ctaText', e.target.value)} className="input w-full" />
//           </div>
//           <div>
//             <label className="label">Button 1 Link</label>
//             <input value={hero.ctaLink || ''} onChange={(e) => set('ctaLink', e.target.value)} placeholder="/article/abc123 or /section/interviews" className="input w-full" />
//           </div>
//           <div>
//             <label className="label">Button 2 Text</label>
//             <input value={hero.ctaText2 || ''} onChange={(e) => set('ctaText2', e.target.value)} className="input w-full" />
//           </div>
//           <div>
//             <label className="label">Button 2 Link</label>
//             <input value={hero.ctaLink2 || ''} onChange={(e) => set('ctaLink2', e.target.value)} placeholder="/live or /regions" className="input w-full" />
//           </div>
//         </div>
//       </div>

//       {/* Media */}
//       <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
//         <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Right-Side Media</h3>
//         <div>
//           <label className="label">Media Type</label>
//           <select value={hero.mediaType || 'image'} onChange={(e) => set('mediaType', e.target.value)} className="input w-full">
//             <option value="image">Upload Image</option>
//             <option value="youtube">YouTube Video (by ID)</option>
//           </select>
//         </div>

//         {hero.mediaType === 'youtube' && (
//           <div>
//             <label className="label">YouTube Video ID</label>
//             <input value={hero.youtubeId || ''} onChange={(e) => set('youtubeId', e.target.value)}
//               placeholder="e.g. M7lc1UVf-VE" className="input w-full" />
//             <p className="mt-1 text-xs text-gray-400">From youtube.com/watch?v=<strong>THIS_ID</strong></p>
//           </div>
//         )}

//         {hero.mediaType === 'image' && (
//           <div>
//             <label className="label">Upload Hero Image</label>
//             <input
//               type="file" accept="image/*"
//               onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)); }}}
//               className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-red-700"
//             />
//             {(preview || hero.mediaUrl) && (
//               <img src={preview || hero.mediaUrl} alt="preview" className="mt-3 h-40 rounded-xl object-cover shadow" />
//             )}
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="label">Badge Text (top-left of media)</label>
//             <input value={hero.badgeText || ''} onChange={(e) => set('badgeText', e.target.value)} className="input w-full" />
//           </div>
//           <div>
//             <label className="label">Caption (under media)</label>
//             <input value={hero.previewCaption || ''} onChange={(e) => set('previewCaption', e.target.value)} className="input w-full" />
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
//         <div className="flex items-center gap-3">
//           <span className="text-sm font-medium text-gray-700">Hero Active</span>
//           <button
//             onClick={() => set('isActive', !hero.isActive)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${hero.isActive ? 'bg-red-600' : 'bg-gray-300'}`}
//           >
//             <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${hero.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
//           </button>
//         </div>
//         <button
//           onClick={handleSave} disabled={saving}
//           className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
//         >
//           {saving ? 'Saving...' : 'Save Changes'}
//         </button>
//       </div>
//     </div>
//   );
// }





import { useEffect, useMemo, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

type HeroItem = {
  _id?: string;
  mediaType: 'image' | 'youtube';
  youtubeId: string;
  mediaUrl: string;
  cloudinaryId?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  ctaText2: string;
  ctaLink2: string;
  badgeText: string;
  previewCaption: string;
  isActive: boolean;
  order: number;
};

const emptyHero: HeroItem = {
  mediaType: 'image',
  youtubeId: 'M7lc1UVf-VE',
  mediaUrl: '',
  title: 'From strategy to statecraft: modern journalism built for global readers',
  subtitle: 'Feature a looping video, hero image or live stream here.',
  ctaText: 'Explore Latest Coverage',
  ctaLink: '#',
  ctaText2: 'Watch Live Demo',
  ctaLink2: '/live',
  badgeText: 'LIVE PREVIEW',
  previewCaption: 'Your top hero can use a featured image or livestream.',
  isActive: true,
  order: 0,
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AdminHero() {
  const { get, post, put, del } = useAdminApi();

  const [heroes, setHeroes] = useState<HeroItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | 'new'>('new');
  const [hero, setHero] = useState<HeroItem>({ ...emptyHero });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const canAddMore = heroes.length < 5;

  const selectedHero = useMemo(
    () => heroes.find((h) => h._id === selectedId),
    [heroes, selectedId]
  );

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    if (selectedId === 'new') {
      setHero({
        ...emptyHero,
        order: heroes.length,
      });
      setPreview('');
      setImageFile(null);
      return;
    }

    if (selectedHero) {
      setHero({ ...selectedHero });
      setPreview('');
      setImageFile(null);
    }
  }, [selectedId, selectedHero, heroes.length]);

  const loadHeroes = async () => {
    try {
      const data = await get('/hero/admin');
      setHeroes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setField = (k: keyof HeroItem, v: any) => {
    setHero((prev) => ({ ...prev, [k]: v }));
  };

  const resetMessage = () => setMsg({ text: '', type: '' });

  const handleSave = async () => {
    resetMessage();
    setSaving(true);

    try {
      const fd = new FormData();
      const fields: (keyof HeroItem)[] = [
        'mediaType',
        'youtubeId',
        'title',
        'subtitle',
        'ctaText',
        'ctaLink',
        'ctaText2',
        'ctaLink2',
        'badgeText',
        'previewCaption',
        'isActive',
        'order',
      ];

      fields.forEach((k) => {
        if (hero[k] !== undefined) {
          fd.append(String(k), String(hero[k] as any));
        }
      });

      if (imageFile) fd.append('media', imageFile);

      let saved;
      if (selectedId === 'new') {
        saved = await post('/hero', fd);
        setMsg({ text: 'Hero added successfully.', type: 'success' });
      } else {
        saved = await put(`/hero/${selectedId}`, fd);
        setMsg({ text: 'Hero updated successfully.', type: 'success' });
      }

      await loadHeroes();
      setSelectedId(saved._id);
      setImageFile(null);
      setPreview('');
    } catch (err: any) {
      setMsg({ text: err?.message || 'Failed to save hero.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const ok = window.confirm('Are you sure you want to delete this hero?');
    if (!ok) return;

    resetMessage();

    try {
      await del(`/hero/${id}`);
      const updatedHeroes = heroes.filter((h) => h._id !== id);
      setHeroes(updatedHeroes);
      setSelectedId('new');
      setMsg({ text: 'Hero deleted successfully.', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err?.message || 'Failed to delete hero.', type: 'error' });
    }
  };

  const moveHero = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroes.length) return;

    const reordered = [...heroes];
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];

    const heroIds = reordered.map((h) => h._id).filter(Boolean);

    try {
      const updated = await put('/hero/reorder/list', { heroIds });
      setHeroes(updated);
    } catch (err) {
      console.error(err);
      setMsg({ text: 'Failed to reorder heroes.', type: 'error' });
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-6xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Hero Section</h2>
        <p className="text-sm text-gray-500">
          Add up to 5 homepage hero slides. Edit, delete, and reorder without changing the approved hero styling.
        </p>
      </div>

      {msg.text && (
        <div className={`rounded-xl px-4 py-3 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.text}
        </div>
      )}

      {/* Existing Heroes List */}
      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-semibold text-gray-800">Existing Hero Items ({heroes.length}/5)</h3>
          <button
            onClick={() => setSelectedId('new')}
            disabled={!canAddMore}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Add New Hero
          </button>
        </div>

        {heroes.length === 0 ? (
          <p className="text-sm text-gray-500">No hero items added yet.</p>
        ) : (
          <div className="space-y-3">
            {heroes.map((item, index) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 rounded-xl border p-3 ${
                  selectedId === item._id ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              >
                <img
                  src={item.mediaType === 'image' ? item.mediaUrl || 'https://via.placeholder.com/120x80?text=Hero' : `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                  alt={item.title}
                  className="h-20 w-32 rounded-lg object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-semibold text-gray-800">{item.title || 'Untitled Hero'}</h4>
                  <p className="truncate text-sm text-gray-500">{item.subtitle || 'No subtitle'}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    #{index + 1} • {item.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => moveHero(index, 'up')}
                    disabled={index === 0}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveHero(index, 'down')}
                    disabled={index === heroes.length - 1}
                    className="rounded-lg border px-3 py-1.5 text-sm text-gray-700 disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => setSelectedId(item._id!)}
                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">
              {selectedId === 'new' ? 'Add New Hero' : 'Edit Hero'}
            </h3>

            <div>
              <label className="label">Main Headline</label>
              <textarea
                rows={2}
                value={hero.title || ''}
                onChange={(e) => setField('title', e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label">Subtitle</label>
              <textarea
                rows={2}
                value={hero.subtitle || ''}
                onChange={(e) => setField('subtitle', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">
              CTA Buttons — Paste article URL in the link field (e.g. /article/abc123)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Button 1 Text</label>
                <input
                  value={hero.ctaText || ''}
                  onChange={(e) => setField('ctaText', e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Button 1 Link</label>
                <input
                  value={hero.ctaLink || ''}
                  onChange={(e) => setField('ctaLink', e.target.value)}
                  placeholder="/article/abc123 or /section/interviews"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Button 2 Text</label>
                <input
                  value={hero.ctaText2 || ''}
                  onChange={(e) => setField('ctaText2', e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Button 2 Link</label>
                <input
                  value={hero.ctaLink2 || ''}
                  onChange={(e) => setField('ctaLink2', e.target.value)}
                  placeholder="/live or /regions"
                  className="input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Right-Side Media</h3>

            <div>
              <label className="label">Media Type</label>
              <select
                value={hero.mediaType || 'image'}
                onChange={(e) => setField('mediaType', e.target.value)}
                className="input w-full"
              >
                <option value="image">Upload Image</option>
                <option value="youtube">YouTube Video (by ID)</option>
              </select>
            </div>

            {hero.mediaType === 'youtube' && (
              <div>
                <label className="label">YouTube Video ID</label>
                <input
                  value={hero.youtubeId || ''}
                  onChange={(e) => setField('youtubeId', e.target.value)}
                  placeholder="e.g. M7lc1UVf-VE"
                  className="input w-full"
                />
                <p className="mt-1 text-xs text-gray-400">
                  From youtube.com/watch?v=<strong>THIS_ID</strong>
                </p>
              </div>
            )}

            {hero.mediaType === 'image' && (
              <div>
                <label className="label">Upload Hero Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setImageFile(f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                  className="w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-red-700"
                />
                {(preview || hero.mediaUrl) && (
                  <img
                    src={preview || hero.mediaUrl}
                    alt="preview"
                    className="mt-3 h-40 rounded-xl object-cover shadow"
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Badge Text (top-left of media)</label>
                <input
                  value={hero.badgeText || ''}
                  onChange={(e) => setField('badgeText', e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Caption (under media)</label>
                <input
                  value={hero.previewCaption || ''}
                  onChange={(e) => setField('previewCaption', e.target.value)}
                  className="input w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Hero Active</span>
              <button
                onClick={() => setField('isActive', !hero.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${hero.isActive ? 'bg-red-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${hero.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : selectedId === 'new' ? 'Add Hero' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}