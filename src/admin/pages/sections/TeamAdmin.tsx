import { useCallback, useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

const SECTIONS = [
  'Managing Editor',
  'Deputy Editor',
  'Writers & Analysts',
  'Correspondents',
  'Political Analysts & Regional Experts',
  'Regional Bureau Leadership',
];

type Country = { name: string; code: string };

const FORM_EMPTY = {
  name: '', role: '', bio: '', section: SECTIONS[0], sortOrder: 0, isActive: true,
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition ${value ? 'bg-red-600' : 'bg-gray-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function CountryRows({ countries, onChange }: { countries: Country[]; onChange: (c: Country[]) => void }) {
  const update = (i: number, field: keyof Country, value: string) => {
    const next = [...countries];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };
  const remove = (i: number) => onChange(countries.filter((_, idx) => idx !== i));
  const add = () => onChange([...countries, { name: '', code: '' }]);

  return (
    <div className="sm:col-span-2">
      <label className="label mb-2 block">Countries (shown as flag badges)</label>
      <div className="space-y-2">
        {countries.map((c, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={c.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Country name — e.g. United Kingdom"
              className="input flex-1"
            />
            <input
              value={c.code}
              onChange={(e) => update(i, 'code', e.target.value.toLowerCase())}
              placeholder="Code — e.g. gb"
              maxLength={2}
              className="input w-24"
            />
            <button onClick={() => remove(i)} className="rounded-lg border border-red-100 px-3 text-xs text-red-600 hover:bg-red-50">Remove</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
        + Add Country
      </button>
      <p className="mt-1 text-[11px] text-gray-400">
        Use the 2-letter ISO country code (gb, us, pk, jp…) — this drives the flag image shown on the public page.
      </p>
    </div>
  );
}

function MemberForm({
  init, onSave, onCancel, saving, error,
}: {
  init?: any;
  onSave: (data: any, file: File | null) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const [f, setF] = useState<any>({ ...FORM_EMPTY, ...(init || {}) });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(init?.imageUrl || '');
  const [countries, setCountries] = useState<Country[]>(init?.countries || []);

  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const handleSave = () => {
    onSave({ ...f, countries: JSON.stringify(countries) }, file);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-5">
      <h3 className="border-b border-gray-100 pb-3 text-base font-semibold text-gray-800">
        {init?._id ? 'Edit' : 'New'} Team Member
      </h3>

      {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Name *</label>
          <input value={f.name} onChange={(e) => s('name', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Role / Title *</label>
          <input value={f.role} onChange={(e) => s('role', e.target.value)} className="input w-full" placeholder="e.g. Writer and Analyst" />
        </div>

        <div>
          <label className="label">Section *</label>
          <select value={f.section} onChange={(e) => s('section', e.target.value)} className="input w-full">
            {SECTIONS.map((sec) => <option key={sec} value={sec}>{sec}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Sort Order (within this section)</label>
          <input type="number" value={f.sortOrder} onChange={(e) => s('sortOrder', Number(e.target.value))} className="input w-full" />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Bio</label>
          <textarea value={f.bio} onChange={(e) => s('bio', e.target.value)} rows={4} className="input w-full" />
        </div>

        <CountryRows countries={countries} onChange={setCountries} />

        <div className="sm:col-span-2">
          <label className="label">Photo</label>
          <div className="flex flex-wrap items-center gap-3">
            {preview && <img src={preview} alt="" className="h-16 w-16 rounded-full object-cover border border-gray-200" />}
            <input
              type="file" accept="image/*"
              onChange={(e) => { const fl = e.target.files?.[0]; if (fl) { setFile(fl); setPreview(URL.createObjectURL(fl)); } }}
              className="text-xs text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-red-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-red-700"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">Active</label>
        <Toggle value={f.isActive} onChange={(v) => s('isActive', v)} />
      </div>

      <div className="flex gap-3 justify-end pt-1">
        <button onClick={onCancel} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={handleSave}
          disabled={saving || !f.name || !f.role}
          className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Member'}
        </button>
      </div>
    </div>
  );
}

function MemberRow({ m, onEdit, onDelete }: { m: any; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      {m.imageUrl ? (
        <img src={m.imageUrl} className="h-14 w-14 rounded-full object-cover" alt="" />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-400">
          {m.name.charAt(0)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">{m.section}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {m.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
        <p className="truncate text-sm font-semibold text-gray-800">{m.name}</p>
        <p className="truncate text-xs text-gray-400">{m.role}</p>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <button onClick={onEdit} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Edit</button>
        <button onClick={onDelete} className="rounded-lg border border-red-100 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
}

export function TeamAdmin() {
  const { get, post, put, del } = useAdminApi();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionFilter, setSectionFilter] = useState('');

  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get('/team/admin');
      setMembers(data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
    // `get` from useAdminApi is not a stable reference across renders —
    // including it here recreates `load` every render, which retriggers
    // the effect below, which fetches again, forever (this is exactly
    // what produced the ERR_INSUFFICIENT_RESOURCES request storm).
    // AdminAllPages.tsx's own `load` avoids this the same way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  const toFD = (f: any, file: File | null) => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      fd.append(k, String(v));
    });
    if (file) fd.append('image', file);
    return fd;
  };

  const handleCreate = async (f: any, file: File | null) => {
    setSaving(true); setSaveError('');
    try {
      await post('/team', toFD(f, file));
      setAdding(false);
      await load();
    } catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleUpdate = async (f: any, file: File | null) => {
    setSaving(true); setSaveError('');
    try {
      await put(`/team/${f._id}`, toFD(f, file));
      setEditId(null);
      await load();
    } catch (e: any) { setSaveError(e.message || 'Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member permanently?')) return;
    try { await del(`/team/${id}`); await load(); }
    catch (e) { console.error(e); }
  };

  const filtered = sectionFilter ? members.filter((m) => m.section === sectionFilter) : members;
  const visibleSections = SECTIONS.filter((sec) => filtered.some((m) => m.section === sec));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
        <p className="text-sm text-gray-500">Managing Editor, Deputy Editor, Writers & Analysts, Correspondents, Political Analysts & Regional Experts, Regional Bureau Leadership.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="input w-full max-w-xs">
            <option value="">All Sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {!adding && !editId && (
            <button
              onClick={() => { setAdding(true); setEditId(null); setSaveError(''); }}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              + New Member
            </button>
          )}
        </div>
      </div>

      {adding && (
        <MemberForm onSave={handleCreate} onCancel={() => { setAdding(false); setSaveError(''); }} saving={saving} error={saveError} />
      )}

      {loading && <div className="py-16 text-center text-gray-400">Loading…</div>}

      {!loading && filtered.length === 0 && !adding && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
          <p className="font-semibold text-gray-500">No team members found</p>
          <p className="mt-1 text-sm text-gray-400">Click "New Member" above, or run the one-time seed script to migrate your existing team.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-6">
          {visibleSections.map((sec) => (
            <div key={sec}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">{sec}</p>
              <div className="space-y-3">
                {filtered.filter((m) => m.section === sec).map((m) =>
                  editId === m._id ? (
                    <MemberForm
                      key={m._id}
                      init={m}
                      onSave={handleUpdate}
                      onCancel={() => { setEditId(null); setSaveError(''); }}
                      saving={saving}
                      error={saveError}
                    />
                  ) : (
                    <MemberRow
                      key={m._id}
                      m={m}
                      onEdit={() => { setEditId(m._id); setAdding(false); setSaveError(''); }}
                      onDelete={() => handleDelete(m._id)}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
