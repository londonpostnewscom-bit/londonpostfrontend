import { useState, useEffect } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

export function AdminPageBanner() {
  const { get, put } = useAdminApi();
  const [banner,  setBanner]  = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [file,    setFile]    = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    get('/page-banner').then(setBanner).catch(console.error).finally(() => setLoading(false));
  }, []);

  const set = (k: string, v: any) => setBanner((b: any) => ({ ...b, [k]: v }));

  const handleSave = async () => {
    if (!banner) return;
    setSaving(true);
    try {
      const fd = new FormData();
      ['title', 'description', 'sponsorText', 'linkUrl'].forEach((k) => {
        if (banner[k] !== undefined) fd.append(k, banner[k]);
      });
      fd.append('isActive', String(banner.isActive));
      if (file) fd.append('image', file);
      const updated = await put('/page-banner', fd);
      setBanner(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setFile(null); setPreview('');
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Banner — All Pages</h2>
        <p className="text-sm text-gray-500">
          This single banner appears in the right sidebar on every region and section page across the whole site.
          Upload an image ad and set a click-through link.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <h3 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Banner Details</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Banner Title</label>
            <input value={banner?.title || ''} onChange={(e) => set('title', e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="label">Sponsor Label</label>
            <input value={banner?.sponsorText || ''} onChange={(e) => set('sponsorText', e.target.value)} className="input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <input value={banner?.description || ''} onChange={(e) => set('description', e.target.value)} className="input w-full" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Click-through Link</label>
            <input value={banner?.linkUrl || ''} onChange={(e) => set('linkUrl', e.target.value)} placeholder="https://" className="input w-full" />
          </div>
        </div>

        <div>
          <label className="label">Banner Image (vertical — shown at min-height 420px)</label>
          <div className="flex flex-wrap items-start gap-4 mt-2">
            {(preview || banner?.imageUrl) && (
              <img
                src={preview || banner.imageUrl}
                alt="Banner preview"
                className="h-32 w-24 rounded-2xl object-cover border border-gray-200 shadow-sm"
              />
            )}
            <div>
              <input
                type="file" accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }}}
                className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
              />
              <p className="mt-2 text-xs text-gray-400">Recommended: portrait format, e.g. 300×600px or 300×420px</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Banner Active</span>
            <button
              onClick={() => set('isActive', !banner?.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${banner?.isActive ? 'bg-red-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${banner?.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm font-medium text-green-600">Saved ✓</span>}
            <button
              onClick={handleSave} disabled={saving}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}