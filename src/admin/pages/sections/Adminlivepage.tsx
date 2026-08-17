import { useState, useEffect, useCallback } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

type LiveVideoDoc = {
  _id: string;
  type: 'main' | 'previous';
  title: string;
  youtubeUrl: string;
  videoId: string;
  date?: string;
  sortOrder?: number;
  isActive: boolean;
};

function ytThumb(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${value ? 'bg-red-600' : 'bg-gray-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

/* ─── Main video card ─────────────────────────────────────────────── */

function MainVideoCard({ main, onSave, saving, error }: {
  main: LiveVideoDoc | null;
  onSave: (data: { title: string; youtubeUrl: string; isActive: boolean }) => void;
  saving: boolean;
  error: string;
}) {
  const [title, setTitle] = useState(main?.title || 'Live Podcast');
  const [youtubeUrl, setYoutubeUrl] = useState(main?.youtubeUrl || '');
  const [isActive, setIsActive] = useState(main?.isActive ?? true);

  useEffect(() => {
    setTitle(main?.title || 'Live Podcast');
    setYoutubeUrl(main?.youtubeUrl || '');
    setIsActive(main?.isActive ?? true);
  }, [main]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-800">Main Featured Video</h3>
        <p className="mt-1 text-xs text-gray-400">
          The big video at the top of the Live page. Paste your live stream's YouTube URL here —
          once the stream ends, YouTube keeps the recording at the exact same URL, so you don't
          need to change anything after it goes offline.
        </p>
      </div>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="input w-full" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">YouTube URL *</label>
          <input
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="input w-full"
          />
        </div>
      </div>

      {main?.videoId && (
        <div className="flex items-center gap-3">
          <img src={ytThumb(main.videoId)} alt="" className="h-16 w-28 rounded-lg object-cover border border-gray-200" />
          <p className="text-xs text-gray-400">Current live thumbnail preview</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Active on site</label>
          <Toggle value={isActive} onChange={setIsActive} />
        </div>
        <button
          onClick={() => onSave({ title, youtubeUrl, isActive })}
          disabled={saving || !youtubeUrl.trim()}
          className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Main Video'}
        </button>
      </div>
    </div>
  );
}

/* ─── Previous video form (add / edit) ────────────────────────────── */

function PreviousVideoForm({ init, onSave, onCancel, saving, error }: {
  init?: LiveVideoDoc | null;
  onSave: (data: { title: string; youtubeUrl: string; date: string; sortOrder: number; isActive: boolean }) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const [title, setTitle] = useState(init?.title || '');
  const [youtubeUrl, setYoutubeUrl] = useState(init?.youtubeUrl || '');
  const [date, setDate] = useState(init?.date || '');
  const [sortOrder, setSortOrder] = useState(init?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(init?.isActive ?? true);

  return (
    <div className="rounded-2xl border-2 border-red-100 bg-red-50/40 p-5 space-y-4">
      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="input w-full bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">YouTube URL *</label>
          <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..." className="input w-full bg-white" />
        </div>
        <div>
          <label className="label">Date</label>
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. July 21, 2026" className="input w-full bg-white" />
        </div>
        <div>
          <label className="label">Sort Order</label>
          <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="input w-full bg-white" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Active</label>
          <Toggle value={isActive} onChange={setIsActive} />
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-white">Cancel</button>
          <button
            onClick={() => onSave({ title, youtubeUrl, date, sortOrder, isActive })}
            disabled={saving || !title.trim() || !youtubeUrl.trim()}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Previous video row ──────────────────────────────────────────── */

function PreviousVideoRow({ v, onEdit, onDelete }: { v: LiveVideoDoc; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-gray-300">
      <img src={ytThumb(v.videoId)} alt="" className="h-14 w-24 flex-shrink-0 rounded-lg object-cover border border-gray-200" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {v.isActive ? 'Active' : 'Hidden'}
          </span>
          <span className="text-xs text-gray-400">Order {v.sortOrder}</span>
        </div>
        <p className="truncate text-sm font-semibold text-gray-800">{v.title}</p>
        <p className="mt-0.5 text-xs text-gray-400">{v.date}</p>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <button onClick={onEdit} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────────── */

export function AdminLivePage() {
  const { get, post, put, del } = useAdminApi();

  const [main, setMain] = useState<LiveVideoDoc | null>(null);
  const [previous, setPrevious] = useState<LiveVideoDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [mainSaving, setMainSaving] = useState(false);
  const [mainError, setMainError] = useState('');

  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get('/live/admin');
      setMain(data.main || null);
      setPrevious(data.previous || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSaveMain = async (payload: { title: string; youtubeUrl: string; isActive: boolean }) => {
    setMainSaving(true); setMainError('');
    try {
      await put('/live/main', payload);
      await load();
    } catch (e: any) { setMainError(e.message || 'Failed to save.'); }
    setMainSaving(false);
  };

  const handleCreate = async (payload: any) => {
    setFormSaving(true); setFormError('');
    try {
      await post('/live/previous', payload);
      setAdding(false);
      await load();
    } catch (e: any) { setFormError(e.message || 'Failed to save.'); }
    setFormSaving(false);
  };

  const handleUpdate = async (id: string, payload: any) => {
    setFormSaving(true); setFormError('');
    try {
      await put(`/live/previous/${id}`, payload);
      setEditId(null);
      await load();
    } catch (e: any) { setFormError(e.message || 'Failed to save.'); }
    setFormSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video permanently?')) return;
    try { await del(`/live/previous/${id}`); await load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Live Podcast</h2>
        <p className="text-sm text-gray-500">Manage the main featured stream and the previous-episodes archive shown on the public Live page.</p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading…</div>
      ) : (
        <>
          <MainVideoCard main={main} onSave={handleSaveMain} saving={mainSaving} error={mainError} />

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Previous Videos</h3>
                <p className="mt-1 text-xs text-gray-400">{previous.length} video{previous.length !== 1 ? 's' : ''} in the archive grid.</p>
              </div>
              {!adding && !editId && (
                <button
                  onClick={() => { setAdding(true); setEditId(null); setFormError(''); }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  + New Video
                </button>
              )}
            </div>

            {adding && (
              <PreviousVideoForm
                onSave={handleCreate}
                onCancel={() => { setAdding(false); setFormError(''); }}
                saving={formSaving}
                error={formError}
              />
            )}

            {previous.length === 0 && !adding && (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
                <p className="font-semibold text-gray-500">No previous videos yet</p>
                <p className="mt-1 text-sm text-gray-400">Click "New Video" to add the first one.</p>
              </div>
            )}

            <div className="space-y-3">
              {previous.map(v =>
                editId === v._id ? (
                  <PreviousVideoForm
                    key={v._id}
                    init={v}
                    onSave={(payload) => handleUpdate(v._id, payload)}
                    onCancel={() => { setEditId(null); setFormError(''); }}
                    saving={formSaving}
                    error={formError}
                  />
                ) : (
                  <PreviousVideoRow
                    key={v._id}
                    v={v}
                    onEdit={() => { setEditId(v._id); setAdding(false); setFormError(''); }}
                    onDelete={() => handleDelete(v._id)}
                  />
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
