
import { useState, useEffect } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

/* ── Shared single-banner editor block ──
   Both sections below (desktop sidebar banner, mobile article banner) use
   this same shape — only the get/put endpoint and a couple of labels
   differ. Kept as one reusable inner component so the two sections stay
   visually and behaviorally consistent, and so a future third banner slot
   is just one more instance of this rather than copy-pasted markup. */
function BannerEditor({
  title,
  helpText,
  imageHint,
  imageAspect,
  getPath,
  putPath,
}: {
  title: string;
  helpText: string;
  imageHint: string;
  imageAspect: 'vertical' | 'horizontal';
  getPath: string;
  putPath: string;
}) {
  const { get, put } = useAdminApi();
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    get(getPath).then(setBanner).catch(console.error).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getPath]);

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
      const updated = await put(putPath, fd);
      setBanner(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setFile(null);
      setPreview('');
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) return <div className="py-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      </div>

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
        <label className="label">Banner Image ({imageHint})</label>
        <div className="flex flex-wrap items-start gap-4 mt-2">
          {(preview || banner?.imageUrl) && (
            <img
              src={preview || banner.imageUrl}
              alt="Banner preview"
              className={
                imageAspect === 'vertical'
                  ? 'h-32 w-24 rounded-2xl object-cover border border-gray-200 shadow-sm'
                  : 'h-16 w-40 rounded-2xl object-cover border border-gray-200 shadow-sm'
              }
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setPreview(URL.createObjectURL(f));
                }
              }}
              className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
            />
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
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Banner'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Kept the same exported name + same file path as before on purpose —
   App.tsx already imports { AdminPageBanner } from this exact path, so
   this file can be dropped in as a straight replacement with zero changes
   needed anywhere else. Internally it now renders BOTH banner sections
   instead of just the one. ── */
export function AdminPageBanner() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Banners</h2>
        <p className="text-sm text-gray-500">
          Manage both site banners from here — the desktop sidebar banner and the mobile article-page banner.
        </p>
      </div>

      <BannerEditor
        title="Desktop — Sidebar Banner (All Pages)"
        helpText="Appears in the right sidebar on every region and section page across the whole site, on desktop screens."
        imageHint="vertical — shown at min-height 420px, e.g. 300×600px"
        imageAspect="vertical"
        getPath="/page-banner"
        putPath="/page-banner"
      />

      <BannerEditor
        title="Mobile — Article Page Banner"
        helpText="Appears inline below the byline on article pages, mobile screens only."
        imageHint="horizontal — shown at min-height 120px, e.g. 728×160px"
        imageAspect="horizontal"
        getPath="/banners/article-mobile-banner"
        putPath="/banners/article-mobile-banner"
      />
    </div>
  );
}
