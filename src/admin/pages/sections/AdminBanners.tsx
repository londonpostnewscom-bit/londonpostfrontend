import { useState, useEffect } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

function BannerCard({ banner, onUpdate }: { banner: any; onUpdate: (b: any) => void }) {
  const { put } = useAdminApi();
  const [form, setForm] = useState({ ...banner });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      ['title', 'description', 'sponsorText', 'linkUrl'].forEach((k) => fd.append(k, form[k] || ''));
      fd.append('isActive', String(form.isActive));
      if (file) fd.append('image', file);
      const updated = await put(`/banners/${banner.identifier}`, fd);
      onUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setFile(null);
      setPreview('');
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{banner.label}</h3>
          <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${banner.isVertical ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
            {banner.isVertical ? 'Vertical Banner' : 'Horizontal Banner'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500">Active</span>
          <button onClick={() => set('isActive', !form.isActive)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${form.isActive ? 'bg-red-600' : 'bg-gray-300'}`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${form.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input value={form.title || ''} onChange={(e) => set('title', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-red-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Sponsor Label</label>
            <input value={form.sponsorText || ''} onChange={(e) => set('sponsorText', e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-red-400" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
          <input value={form.description || ''} onChange={(e) => set('description', e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-red-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Click-through Link</label>
          <input value={form.linkUrl || ''} onChange={(e) => set('linkUrl', e.target.value)}
            placeholder="https://" className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-red-400" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Banner Image</label>
          <div className="flex items-center gap-3 flex-wrap">
            {(preview || form.imageUrl) && (
              <img src={preview || form.imageUrl} alt="" className="h-14 w-20 rounded-lg object-cover border" />
            )}
            <input type="file" accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }}}
              className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-2 file:py-1 file:text-xs file:font-medium file:text-red-700" />
          </div>
        </div>
        <div className="flex items-center justify-end pt-1">
          {saved && <span className="mr-3 text-xs font-medium text-green-600">Saved ✓</span>}
          <button onClick={handleSave} disabled={saving}
            className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminBanners() {
  const { get } = useAdminApi();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/banners').then(setBanners).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-400">Loading banners...</div>;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Ad Banners</h2>
        <p className="text-sm text-gray-500">4 banners on the homepage. Upload an image to replace the placeholder. Each banner keeps its fixed position.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {banners.map((b) => (
          <BannerCard key={b.identifier} banner={b} onUpdate={(u) => setBanners((prev) => prev.map((x) => x.identifier === u.identifier ? u : x))} />
        ))}
      </div>
    </div>
  );
}