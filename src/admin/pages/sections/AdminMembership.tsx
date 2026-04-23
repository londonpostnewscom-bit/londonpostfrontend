import { useState, useEffect } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  declined:  'bg-red-100 text-red-700',
};

function PlanEditor({ plan, onSaved }: { plan: any; onSaved: (p: any) => void }) {
  const { put } = useAdminApi();
  const [f, setF]     = useState({ ...plan, features: plan.features.join('\n') });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const s = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...f,
        features: f.features.split('\n').map((l: string) => l.trim()).filter(Boolean),
        isPopular: f.isPopular,
        isActive:  f.isActive,
        sortOrder: Number(f.sortOrder),
      };
      const updated = await put(`/membership/admin/plans/${plan.identifier}`, (() => {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => {
          if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
          else fd.append(k, String(v));
        });
        return fd;
      })());
      onSaved(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className={`rounded-2xl border p-5 ${f.isPopular ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{plan.name}</h3>
        <div className="flex items-center gap-3">
          {f.isPopular && <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Most Popular</span>}
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
            {f.isActive ? 'Active' : 'Hidden'}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Plan Name</label>
          <input value={f.name} onChange={(e) => s('name', e.target.value)} className="input w-full" />
        </div>
        <div>
          <label className="label">Price (e.g. £49/month)</label>
          <input value={f.price} onChange={(e) => s('price', e.target.value)} className="input w-full" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Summary</label>
          <input value={f.summary} onChange={(e) => s('summary', e.target.value)} className="input w-full" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Features (one per line)</label>
          <textarea
            value={f.features}
            onChange={(e) => s('features', e.target.value)}
            rows={4}
            className="input w-full resize-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Details (expanded description)</label>
          <textarea
            value={f.details}
            onChange={(e) => s('details', e.target.value)}
            rows={2}
            className="input w-full resize-none"
          />
        </div>
        <div>
          <label className="label">Sort Order</label>
          <input type="number" value={f.sortOrder} onChange={(e) => s('sortOrder', e.target.value)} className="input w-full" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Mark as Popular</label>
          <button
            onClick={() => s('isPopular', !f.isPopular)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${f.isPopular ? 'bg-red-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${f.isPopular ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Active</label>
          <button
            onClick={() => s('isActive', !f.isActive)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${f.isActive ? 'bg-red-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${f.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {saved && <span className="text-xs font-medium text-green-600">Saved ✓</span>}
          <button
            onClick={handleSave} disabled={saving}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminMembership() {
  const { get, put } = useAdminApi();
  const [tab,         setTab]         = useState<'plans' | 'submissions'>('plans');
  const [plans,       setPlans]       = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingP,    setLoadingP]    = useState(true);
  const [loadingS,    setLoadingS]    = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    get('/membership/admin/plans').then(setPlans).finally(() => setLoadingP(false));
  }, []);

  useEffect(() => {
    if (tab !== 'submissions') return;
    setLoadingS(true);
    const url = filterStatus ? `/membership/admin/submissions?status=${filterStatus}` : '/membership/admin/submissions';
    get(url).then(setSubmissions).finally(() => setLoadingS(false));
  }, [tab, filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const updated = await put(`/membership/admin/submissions/${id}`, (() => {
        const fd = new FormData();
        fd.append('status', status);
        return fd;
      })());
      setSubmissions((prev) => prev.map((s) => s._id === id ? updated : s));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Membership</h2>
        <p className="text-sm text-gray-500">Manage subscription plans and view user enquiries.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['plans', 'submissions'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
              tab === t ? 'bg-red-600 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t === 'plans' ? 'Plans' : `Submissions ${submissions.length > 0 ? `(${submissions.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Plans tab */}
      {tab === 'plans' && (
        <div className="space-y-4">
          {loadingP ? (
            <div className="py-16 text-center text-gray-400">Loading plans...</div>
          ) : (
            plans.map((plan) => (
              <PlanEditor
                key={plan.identifier}
                plan={plan}
                onSaved={(updated) => setPlans((prev) => prev.map((p) => p.identifier === updated.identifier ? updated : p))}
              />
            ))
          )}
        </div>
      )}

      {/* Submissions tab */}
      {tab === 'submissions' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {['', 'new', 'contacted', 'converted', 'declined'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filterStatus === s ? 'bg-gray-900 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loadingS ? (
            <div className="py-16 text-center text-gray-400">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
              No submissions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div key={sub._id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[sub.status] || 'bg-gray-100 text-gray-600'}`}>
                          {sub.status}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          {sub.planName}
                        </span>
                        {sub.isStudent && (
                          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                            Student ⚠ Proof required
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800">{sub.customerName}</p>
                      <p className="text-sm text-gray-500">{sub.email}{sub.phone ? ` · ${sub.phone}` : ''}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {/* Status changer */}
                    <select
                      value={sub.status}
                      onChange={(e) => updateStatus(sub._id, e.target.value)}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}